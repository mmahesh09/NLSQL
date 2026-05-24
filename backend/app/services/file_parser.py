import io
import uuid
from typing import Dict, Optional

import pandas as pd

_sessions: Dict[str, pd.DataFrame] = {}


def parse_file(content: bytes, filename: str) -> pd.DataFrame:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext == "csv":
        df = pd.read_csv(io.BytesIO(content))
    elif ext in ("xlsx", "xls"):
        df = pd.read_excel(io.BytesIO(content))
    elif ext == "json":
        df = pd.read_json(io.BytesIO(content))
    else:
        raise ValueError(f"Unsupported file type: .{ext}")
    df.columns = [str(c).strip().replace(" ", "_").lower() for c in df.columns]
    return df


def store_dataframe(df: pd.DataFrame) -> str:
    session_id = str(uuid.uuid4())
    _sessions[session_id] = df
    return session_id


def get_dataframe(session_id: str) -> Optional[pd.DataFrame]:
    return _sessions.get(session_id)


def get_schema_info(df: pd.DataFrame) -> list:
    schema = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        if "int" in dtype:
            dtype_simple = "INTEGER"
        elif "float" in dtype:
            dtype_simple = "REAL"
        elif "datetime" in dtype:
            dtype_simple = "DATETIME"
        else:
            dtype_simple = "TEXT"
        schema.append({"name": col, "dtype": dtype_simple})
    return schema
