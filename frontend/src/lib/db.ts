import { Pool } from 'pg'
import type { ColumnStats } from './schema-analyzer'

let _pool: Pool | null = null

export function getPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.warn('[db] DATABASE_URL missing — PostgreSQL storage disabled')
    return null
  }
  if (!_pool) {
    _pool = new Pool({ connectionString: dbUrl })
  }
  return _pool
}

export async function ensureSessionsTable(): Promise<void> {
  const pool = getPool()
  if (!pool) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nlsql_sessions (
      session_id  TEXT PRIMARY KEY,
      filename    TEXT    NOT NULL,
      table_name  TEXT    NOT NULL,
      row_count   INTEGER NOT NULL,
      col_count   INTEGER NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)
}

export async function createSessionTable(
  sessionId: string,
  columns: ColumnStats[]
): Promise<string | null> {
  const pool = getPool()
  if (!pool) return null

  const tableName = `session_${sessionId.replace(/-/g, '_')}`

  const colDefs = columns
    .map((c) => {
      const pgType =
        c.type === 'integer' ? 'BIGINT'
        : c.type === 'float'   ? 'DOUBLE PRECISION'
        : c.type === 'boolean' ? 'BOOLEAN'
        : 'TEXT'
      const safeName = `"${c.name.replace(/"/g, '""')}"`
      return `${safeName} ${pgType}`
    })
    .join(',\n    ')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      _row_id SERIAL PRIMARY KEY,
      ${colDefs}
    )
  `)

  return tableName
}

const BATCH_SIZE = 500

export async function insertRows(
  tableName: string,
  rows: Record<string, unknown>[],
  columns: string[]
): Promise<void> {
  const pool = getPool()
  if (!pool || rows.length === 0) return

  const safeCols = columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(', ')

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const values: unknown[] = []
    const rowPlaceholders = batch.map((row, ri) => {
      const colPlaceholders = columns.map((col, ci) => {
        values.push(row[col] ?? null)
        return `$${ri * columns.length + ci + 1}`
      })
      return `(${colPlaceholders.join(', ')})`
    })

    await pool.query(
      `INSERT INTO "${tableName}" (${safeCols}) VALUES ${rowPlaceholders.join(', ')}`,
      values
    )
  }
}

export async function recordSession(
  sessionId: string,
  filename: string,
  tableName: string,
  rowCount: number,
  colCount: number
): Promise<void> {
  const pool = getPool()
  if (!pool) return
  await pool.query(
    `INSERT INTO nlsql_sessions (session_id, filename, table_name, row_count, col_count)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (session_id) DO NOTHING`,
    [sessionId, filename, tableName, rowCount, colCount]
  )
}
