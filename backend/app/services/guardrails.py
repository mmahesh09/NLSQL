import re
from typing import Tuple

# Keywords that suggest the question is about data analysis
_DATA_KEYWORDS = re.compile(
    r'\b(show|list|find|count|sum|average|avg|max|min|total|top|bottom|filter|where|'
    r'group|sort|order|compare|trend|distribution|how many|what is|which|select|'
    r'column|row|record|table|data|value|percent|ratio)\b',
    re.IGNORECASE,
)

# Patterns we never want to see in generated SQL
_BLOCKED_SQL = re.compile(
    r'\b(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE|REPLACE|MERGE|EXEC|EXECUTE|'
    r'GRANT|REVOKE|ATTACH|DETACH)\b',
    re.IGNORECASE,
)

_MUST_START_WITH = re.compile(r'^\s*(SELECT|WITH)\b', re.IGNORECASE)


def check_input(question: str) -> Tuple[bool, str]:
    """Return (True, '') when question looks data-related, else (False, reason)."""
    q = question.strip()
    if len(q) < 3:
        return False, "Question is too short."
    if len(q) > 2000:
        return False, "Question is too long (max 2000 characters)."

    # Allow if it contains any data-analysis keyword
    if _DATA_KEYWORDS.search(q):
        return True, ""

    # Short questions without keywords are still ok (e.g. "top 5 sales")
    if len(q.split()) <= 8:
        return True, ""

    return False, "Question doesn't appear to be about data analysis. Please ask something about your uploaded data."


def validate_sql(sql: str) -> Tuple[bool, str]:
    """Return (True, '') when SQL is safe read-only, else (False, reason)."""
    if not sql or not sql.strip():
        return False, "Empty SQL query."

    match = _BLOCKED_SQL.search(sql)
    if match:
        return False, f"SQL contains forbidden operation: {match.group().upper()}"

    if not _MUST_START_WITH.match(sql):
        return False, "Only SELECT / WITH queries are allowed."

    return True, ""
