from fastapi import APIRouter, HTTPException

from app.models.schemas import ChartConfig, QueryOptimizationResult, QueryRequest, QueryResponse, OptimizationItem
from app.services.file_parser import get_dataframe, get_schema_info
from app.services.guardrails import check_input, validate_sql
from app.services.nl_to_sql import generate_sql
from app.services.query_optimizer import optimize_query

router = APIRouter()


@router.post("/query", response_model=QueryResponse)
async def run_query(req: QueryRequest):
    df = get_dataframe(req.session_id)
    if df is None:
        raise HTTPException(404, "Session not found. Please upload a file first.")

    # 1. Input guardrail
    ok, reason = check_input(req.question)
    if not ok:
        return QueryResponse(
            sql="", explanation="", columns=[], rows=[], row_count=0,
            error=f"Guardrail: {reason}",
        )

    schema = get_schema_info(df)

    # 2. AI SQL generation
    try:
        ai_result = generate_sql(schema, df, req.question, model=req.model)
    except Exception as e:
        raise HTTPException(500, f"AI generation failed: {e}")

    sql         = ai_result.get("sql", "")
    explanation = ai_result.get("explanation", "")
    chart_data  = ai_result.get("chart")

    # 3. SQL safety check
    ok, reason = validate_sql(sql)
    if not ok:
        return QueryResponse(
            sql=sql, explanation=explanation, columns=[], rows=[], row_count=0,
            error=f"SQL safety check failed: {reason}",
        )

    # 4. Query optimization
    opt_result = optimize_query(sql, schema, len(df))
    optimized_sql = opt_result["optimized_sql"]

    optimization = QueryOptimizationResult(
        optimized_sql=optimized_sql,
        was_modified=opt_result["was_modified"],
        optimizations=[OptimizationItem(**o) for o in opt_result["optimizations"]],
        cost_level=opt_result["cost_level"],
        cost_score=opt_result["cost_score"],
        performance_gain=opt_result.get("performance_gain"),
    )

    # 5. Execute optimized SQL
    from app.services.query_executor import execute_sql
    try:
        columns, rows = execute_sql(df, optimized_sql)
    except Exception as e:
        # Fallback: try the original SQL
        try:
            columns, rows = execute_sql(df, sql)
            optimization.optimized_sql = sql
            optimization.was_modified = False
        except Exception as e2:
            return QueryResponse(
                sql=sql, explanation=explanation, columns=[], rows=[], row_count=0,
                error=f"SQL execution error: {e2}",
                optimization=optimization,
            )

    # 6. Build chart config
    chart = None
    if chart_data and chart_data.get("type") not in (None, "none"):
        chart = ChartConfig(
            type=chart_data.get("type", "bar"),
            x_key=chart_data.get("x_key"),
            y_keys=chart_data.get("y_keys", []),
            title=chart_data.get("title"),
        )

    return QueryResponse(
        sql=optimized_sql,
        explanation=explanation,
        columns=columns,
        rows=rows,
        row_count=len(rows),
        chart=chart,
        optimization=optimization,
    )
