import json
import os
from typing import Any, Dict, List

import pandas as pd
from openai import OpenAI

from app.services.query_executor import execute_sql as _execute_sql

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    default_headers={
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NLSQL QueryAI",
    },
)

SYSTEM_PROMPT = """You are an expert SQL analyst. You have access to tools to inspect and query the uploaded data table.

Workflow:
1. Call get_schema to understand the columns and their types.
2. Optionally call sample_data to see example values.
3. Call execute_sql to run your query and verify results.
4. Once you have the final answer, respond with ONLY a JSON object (no markdown) in this exact format:

{
  "sql": "SELECT ...",
  "explanation": "This query ...",
  "chart": {
    "type": "bar|line|pie|scatter|area|none",
    "x_key": "column_name",
    "y_keys": ["column_name"],
    "title": "Chart Title"
  }
}

Rules:
- The table is always named "data"
- Set chart.type to "none" when results have only one row or no numeric columns
- For pie charts: x_key is the label column, y_keys has exactly one numeric column
- Always use double quotes for string literals in SQL
- Limit results to 100 rows unless the user asks for more
"""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_schema",
            "description": "Returns the table schema — column names and their data types. Call this first.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "sample_data",
            "description": "Returns the first N rows of the table as JSON to understand actual data values.",
            "parameters": {
                "type": "object",
                "properties": {
                    "n": {"type": "integer", "description": "Number of rows to return (default 5, max 20)"}
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "execute_sql",
            "description": "Executes a SELECT SQL query on the table named 'data'. Returns columns and rows.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "A valid SQLite SELECT query"}
                },
                "required": ["sql"],
            },
        },
    },
]


def _run_tool(name: str, args: Dict, schema: List[Dict], df: pd.DataFrame) -> str:
    if name == "get_schema":
        return json.dumps(schema)

    if name == "sample_data":
        n = min(int(args.get("n", 5)), 20)
        return df.head(n).astype(object).fillna("").to_json(orient="records")

    if name == "execute_sql":
        sql = args.get("sql", "")
        try:
            columns, rows = _execute_sql(df, sql)
            return json.dumps({"columns": columns, "rows": rows[:20]})
        except Exception as e:
            return json.dumps({"error": str(e)})

    return json.dumps({"error": f"Unknown tool: {name}"})


def generate_sql(
    schema: List[Dict],
    df: pd.DataFrame,
    question: str,
    model: str = "openai/gpt-4o-mini",
) -> Dict[str, Any]:
    messages: List[Dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"User question: {question}"},
    ]

    for _ in range(6):  # max 6 iterations of the tool loop
        response = client.chat.completions.create(
            model=model,
            max_tokens=2048,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
        )

        choice = response.choices[0]
        msg = choice.message

        # Append assistant turn (may include tool_calls)
        messages.append(msg.model_dump(exclude_unset=True))

        if choice.finish_reason == "tool_calls" and msg.tool_calls:
            for tc in msg.tool_calls:
                args = json.loads(tc.function.arguments or "{}")
                result = _run_tool(tc.function.name, args, schema, df)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result,
                })
            continue  # feed tool results back to the model

        # finish_reason == "stop" — parse the final JSON answer
        text = (msg.content or "").strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        return json.loads(text)

    raise RuntimeError("Agent loop exceeded maximum iterations without producing an answer.")
