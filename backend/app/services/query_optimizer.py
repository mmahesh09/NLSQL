"""
Query optimization layer.
Analyzes generated SQL before execution, rewrites where safe,
and returns cost classification + optimization suggestions.
"""
import re
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_RE_SELECT_STAR = re.compile(r'\bSELECT\s+\*(?:\s|,|$)', re.IGNORECASE)
_RE_LIMIT       = re.compile(r'\bLIMIT\s+\d+', re.IGNORECASE)
_RE_SUBQUERY    = re.compile(r'\(\s*SELECT\b', re.IGNORECASE)
_RE_LEFT_JOIN   = re.compile(r'\bLEFT\s+(?:OUTER\s+)?JOIN\b', re.IGNORECASE)
_RE_JOIN        = re.compile(r'\b(?:LEFT|RIGHT|FULL|CROSS|INNER)?\s*JOIN\b', re.IGNORECASE)
_RE_GROUP_BY    = re.compile(r'\bGROUP\s+BY\b', re.IGNORECASE)
_RE_ORDER_BY    = re.compile(r'\bORDER\s+BY\b', re.IGNORECASE)
_RE_DISTINCT    = re.compile(r'\bSELECT\s+DISTINCT\b', re.IGNORECASE)
_RE_HAVING      = re.compile(r'\bHAVING\b', re.IGNORECASE)
_RE_WHERE       = re.compile(r'\bWHERE\b', re.IGNORECASE)
_RE_WHERE_COL   = re.compile(r'\bWHERE\s+(\w+)\s*=', re.IGNORECASE)
_RE_ORDER_COL   = re.compile(r'\bORDER\s+BY\s+(\w+)', re.IGNORECASE)
_RE_GROUP_COL   = re.compile(r'\bGROUP\s+BY\s+(\w+)', re.IGNORECASE)
_RE_WINDOW_FN   = re.compile(r'\b(?:ROW_NUMBER|RANK|DENSE_RANK|NTILE|LAG|LEAD|FIRST_VALUE|LAST_VALUE)\s*\(', re.IGNORECASE)
_RE_CTE         = re.compile(r'^\s*WITH\b', re.IGNORECASE)


def _col_ref(name: str) -> str:
    """Quote column name if it contains spaces or special chars."""
    if re.search(r'[^a-zA-Z0-9_]', name):
        return f'"{name}"'
    return name


# ---------------------------------------------------------------------------
# Rule implementations
# ---------------------------------------------------------------------------

def _rule_select_star(sql: str, columns: List[str]) -> Tuple[str, Optional[Dict]]:
    """Replace SELECT * with explicit column list."""
    if not _RE_SELECT_STAR.search(sql):
        return sql, None
    if not columns:
        return sql, None

    col_list = ', '.join(_col_ref(c) for c in columns[:30])  # cap at 30 cols
    # Replace "SELECT *" (and any trailing space/comma) with column list
    new_sql = re.sub(r'\bSELECT\s+\*', f'SELECT {col_list}', sql, count=1, flags=re.IGNORECASE)
    return new_sql, {
        "rule": "Column Expansion",
        "description": f"Replaced SELECT * with {len(columns)} explicit column(s) — avoids fetching unused data.",
        "applied": True,
        "impact": "medium",
    }


def _rule_limit(sql: str, row_count: int) -> Tuple[str, Optional[Dict]]:
    """Add LIMIT clause if missing and table is large."""
    if _RE_LIMIT.search(sql):
        return sql, None
    if row_count < 500:
        return sql, None  # small datasets don't need forced limits

    new_sql = sql.rstrip().rstrip(';') + ' LIMIT 1000'
    return new_sql, {
        "rule": "Row Limit Enforced",
        "description": f"Added LIMIT 1000 — table has {row_count:,} rows. Prevents full-scan result dumps.",
        "applied": True,
        "impact": "high",
    }


def _rule_subqueries(sql: str) -> Optional[Dict]:
    count = len(_RE_SUBQUERY.findall(sql))
    if count == 0:
        return None
    return {
        "rule": "Subquery Detected",
        "description": (
            f"Found {count} nested subquery(ies). "
            "Consider rewriting as CTEs (WITH clause) for readability and better query planning."
        ),
        "applied": False,
        "impact": "medium",
    }


def _rule_left_join(sql: str) -> Optional[Dict]:
    lj = len(_RE_LEFT_JOIN.findall(sql))
    if lj == 0:
        return None
    return {
        "rule": "Join Optimization",
        "description": (
            f"Found {lj} LEFT JOIN(s). "
            "Prefer INNER JOIN when outer rows are not needed — it allows the optimizer to reorder joins."
        ),
        "applied": False,
        "impact": "medium",
    }


def _rule_filter_pushdown(sql: str, row_count: int) -> Optional[Dict]:
    """Suggest filter pushdown when GROUP BY exists without WHERE on a large table."""
    if not _RE_GROUP_BY.search(sql):
        return None
    if _RE_WHERE.search(sql):
        return None
    if row_count < 10_000:
        return None
    return {
        "rule": "Filter Pushdown",
        "description": (
            "GROUP BY without a preceding WHERE clause causes full-table aggregation. "
            "Adding a WHERE filter before grouping can reduce rows processed significantly."
        ),
        "applied": False,
        "impact": "high",
    }


def _rule_distinct(sql: str) -> Optional[Dict]:
    if not _RE_DISTINCT.search(sql):
        return None
    return {
        "rule": "DISTINCT Usage",
        "description": (
            "SELECT DISTINCT scans and deduplicates all rows. "
            "If the column already has unique values, or if you control the source, GROUP BY may be faster."
        ),
        "applied": False,
        "impact": "low",
    }


def _rule_window_functions(sql: str) -> Optional[Dict]:
    if not _RE_WINDOW_FN.search(sql):
        return None
    return {
        "rule": "Window Function",
        "description": (
            "Window functions (ROW_NUMBER, RANK, etc.) re-scan the partition for each row. "
            "Ensure ORDER BY inside OVER() uses indexed columns when possible."
        ),
        "applied": False,
        "impact": "low",
    }


def _rule_index_suggestions(sql: str, row_count: int) -> Optional[Dict]:
    if row_count < 5_000:
        return None

    where_cols  = _RE_WHERE_COL.findall(sql)
    order_cols  = _RE_ORDER_COL.findall(sql)
    group_cols  = _RE_GROUP_COL.findall(sql)
    candidates  = list(dict.fromkeys(where_cols + order_cols + group_cols))[:4]

    if not candidates:
        return None

    examples = ' | '.join(f'CREATE INDEX idx_{c} ON data({c})' for c in candidates[:2])
    return {
        "rule": "Index Recommendation",
        "description": (
            f"Column(s) used in filters/ordering: {', '.join(candidates)}. "
            f"Example: {examples}"
        ),
        "applied": False,
        "impact": "high",
    }


def _rule_cte_check(sql: str) -> Optional[Dict]:
    """Detect repeated identical subexpressions that could be extracted to a CTE."""
    # Simple heuristic: same subquery text appears more than once
    subqueries = _RE_SUBQUERY.findall(sql)
    if len(subqueries) >= 2:
        return {
            "rule": "CTE Opportunity",
            "description": (
                "Multiple subqueries detected. Extracting repeated logic into a WITH (CTE) block "
                "avoids redundant computation and improves readability."
            ),
            "applied": False,
            "impact": "medium",
        }
    return None


# ---------------------------------------------------------------------------
# Cost scoring
# ---------------------------------------------------------------------------

def _score_cost(sql: str, row_count: int) -> Tuple[str, int]:
    """Return (level, score). Level: 'low' | 'medium' | 'high'."""
    score = 0

    # Row volume
    if row_count > 100_000:
        score += 4
    elif row_count > 10_000:
        score += 2
    elif row_count > 1_000:
        score += 1

    # Query operations
    joins = len(_RE_JOIN.findall(sql))
    score += joins * 2

    subqueries = len(_RE_SUBQUERY.findall(sql))
    score += subqueries * 3

    if _RE_GROUP_BY.search(sql): score += 1
    if _RE_ORDER_BY.search(sql): score += 1
    if _RE_DISTINCT.search(sql): score += 1
    if _RE_HAVING.search(sql):   score += 1
    if _RE_WINDOW_FN.search(sql): score += 2
    if not _RE_LIMIT.search(sql): score += 2  # missing limit on raw optimized SQL
    if _RE_SELECT_STAR.search(sql): score += 1

    level = "low" if score <= 2 else ("medium" if score <= 5 else "high")
    return level, score


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def optimize_query(
    sql: str,
    schema: List[Dict[str, str]],
    row_count: int,
) -> Dict[str, Any]:
    """
    Analyze and optionally rewrite the SQL query.

    Returns:
        optimized_sql   – rewritten SQL (or original if no changes)
        was_modified    – True if SQL was changed
        optimizations   – list of applied/suggested optimization dicts
        cost_level      – 'low' | 'medium' | 'high'
        cost_score      – numeric score
        performance_gain – e.g. '24%' or None
    """
    columns = [c["name"] for c in schema]
    optimizations: List[Dict] = []
    optimized_sql = sql

    # --- Applied rewrites (modify SQL) ---
    optimized_sql, opt = _rule_select_star(optimized_sql, columns)
    if opt: optimizations.append(opt)

    optimized_sql, opt = _rule_limit(optimized_sql, row_count)
    if opt: optimizations.append(opt)

    # --- Informational suggestions (do not modify SQL) ---
    for fn in [
        lambda: _rule_subqueries(optimized_sql),
        lambda: _rule_cte_check(optimized_sql),
        lambda: _rule_left_join(optimized_sql),
        lambda: _rule_filter_pushdown(optimized_sql, row_count),
        lambda: _rule_distinct(optimized_sql),
        lambda: _rule_window_functions(optimized_sql),
        lambda: _rule_index_suggestions(optimized_sql, row_count),
    ]:
        result = fn()
        if result:
            optimizations.append(result)

    # --- Cost analysis ---
    cost_level, cost_score = _score_cost(optimized_sql, row_count)

    # --- Performance gain estimate ---
    applied_high   = sum(1 for o in optimizations if o["applied"] and o["impact"] == "high")
    applied_medium = sum(1 for o in optimizations if o["applied"] and o["impact"] == "medium")
    gain = applied_high * 18 + applied_medium * 8
    gain = min(gain, 65)
    performance_gain = f"{gain}%" if gain > 0 else None

    return {
        "optimized_sql":    optimized_sql,
        "was_modified":     optimized_sql.strip() != sql.strip(),
        "optimizations":    optimizations,
        "cost_level":       cost_level,
        "cost_score":       cost_score,
        "performance_gain": performance_gain,
    }
