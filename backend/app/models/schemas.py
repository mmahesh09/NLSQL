from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ColumnInfo(BaseModel):
    name: str
    dtype: str


class UploadResponse(BaseModel):
    session_id: str
    filename: str
    columns: List[ColumnInfo]
    row_count: int
    preview: List[Dict[str, Any]]


class QueryRequest(BaseModel):
    session_id: str
    question: str
    model: str = "openai/gpt-4o-mini"


class ChartConfig(BaseModel):
    type: str
    x_key: Optional[str] = None
    y_keys: Optional[List[str]] = None
    title: Optional[str] = None


class OptimizationItem(BaseModel):
    rule: str
    description: str
    applied: bool
    impact: str  # "low" | "medium" | "high"


class QueryOptimizationResult(BaseModel):
    optimized_sql: str
    was_modified: bool
    optimizations: List[OptimizationItem]
    cost_level: str        # "low" | "medium" | "high"
    cost_score: int
    performance_gain: Optional[str] = None


class QueryResponse(BaseModel):
    sql: str
    explanation: str
    columns: List[str]
    rows: List[List[Any]]
    row_count: int
    chart: Optional[ChartConfig] = None
    error: Optional[str] = None
    optimization: Optional[QueryOptimizationResult] = None
