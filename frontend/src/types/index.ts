export interface ColumnInfo {
  name: string;
  dtype: string;
}

export interface UploadResult {
  session_id: string;
  filename: string;
  columns: ColumnInfo[];
  row_count: number;
  preview: Record<string, unknown>[];
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'none';
  x_key?: string;
  y_keys?: string[];
  title?: string;
}

export interface OptimizationItem {
  rule: string;
  description: string;
  applied: boolean;
  impact: 'low' | 'medium' | 'high';
}

export interface QueryOptimizationResult {
  optimized_sql: string;
  was_modified: boolean;
  optimizations: OptimizationItem[];
  cost_level: 'low' | 'medium' | 'high';
  cost_score: number;
  performance_gain?: string | null;
}

export interface QueryResult {
  sql: string;
  explanation: string;
  columns: string[];
  rows: unknown[][];
  row_count: number;
  chart?: ChartConfig | null;
  error?: string | null;
  optimization?: QueryOptimizationResult | null;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  queryResult?: QueryResult;
  uploadResult?: UploadResult;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  sessionId?: string;
  uploadedFile?: string;
  createdAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
}
