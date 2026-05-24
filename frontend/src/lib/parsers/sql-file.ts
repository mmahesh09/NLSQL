import { Parser } from 'node-sql-parser'
import type { ParsedFile } from './index'

interface CreateColumn {
  resource: string
  column: { column: string }
  definition?: { dataType?: string }
}

export function parseSQL(buffer: ArrayBuffer): ParsedFile {
  const text = new TextDecoder().decode(buffer)
  const parser = new Parser()

  let statements: unknown[]
  try {
    const ast = parser.astify(text, { database: 'MySQL' })
    statements = Array.isArray(ast) ? ast : [ast]
  } catch {
    // If SQL can't be parsed, treat it as raw text with a single "sql" column
    return { rows: [{ sql: text }], columns: ['sql'], rawSQL: text }
  }

  // Extract schema info from CREATE TABLE statements
  const schemaRows: Record<string, unknown>[] = []

  for (const stmt of statements as Record<string, unknown>[]) {
    if (stmt.type !== 'create') continue

    const tableArr = stmt.table as Array<{ table: string }> | undefined
    if (!tableArr?.[0]) continue
    const tableName = tableArr[0].table

    const defs = (stmt.create_definitions as CreateColumn[] | undefined) ?? []
    for (const def of defs) {
      if (def.resource !== 'column') continue
      schemaRows.push({
        table_name: tableName,
        column_name: def.column.column,
        data_type: def.definition?.dataType ?? 'UNKNOWN',
      })
    }
  }

  if (schemaRows.length === 0) {
    return { rows: [{ sql: text }], columns: ['sql'], rawSQL: text }
  }

  return {
    rows: schemaRows,
    columns: ['table_name', 'column_name', 'data_type'],
    rawSQL: text,
  }
}
