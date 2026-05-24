import sqlite3
from typing import Any, List, Tuple

import pandas as pd


def execute_sql(df: pd.DataFrame, sql: str) -> Tuple[List[str], List[List[Any]]]:
    conn = sqlite3.connect(":memory:")
    try:
        df.to_sql("data", conn, if_exists="replace", index=False)
        cursor = conn.execute(sql)
        columns = [desc[0] for desc in cursor.description]
        rows = [list(row) for row in cursor.fetchall()]
        return columns, rows
    finally:
        conn.close()
