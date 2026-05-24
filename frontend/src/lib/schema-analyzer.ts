export type ColumnType = 'integer' | 'float' | 'boolean' | 'date' | 'text' | 'unknown'

export interface ColumnStats {
  name: string
  type: ColumnType
  sampleValues: unknown[]
  nullCount: number
  uniqueCount: number
}

export interface SchemaAnalysis {
  columns: ColumnStats[]
  rowCount: number
  /** Human-readable text description used for embedding */
  semanticDescription: string
}

function inferType(values: unknown[]): ColumnType {
  if (values.length === 0) return 'unknown'
  const sample = values[0]
  if (typeof sample === 'boolean') return 'boolean'
  if (typeof sample === 'number') return Number.isInteger(sample) ? 'integer' : 'float'
  if (typeof sample === 'string') {
    // ISO date patterns: 2024-01-15, 2024-01-15T10:00:00Z
    if (/^\d{4}-\d{2}-\d{2}/.test(sample)) return 'date'
    return 'text'
  }
  return 'unknown'
}

export function analyzeSchema(
  rows: Record<string, unknown>[],
  columns: string[]
): SchemaAnalysis {
  const stats: ColumnStats[] = columns.map((col) => {
    const allValues = rows.map((r) => r[col])
    const nonNull = allValues.filter((v) => v !== null && v !== undefined && v !== '')
    const unique = Array.from(new Set(nonNull))

    return {
      name: col,
      type: inferType(nonNull),
      sampleValues: unique.slice(0, 5),
      nullCount: allValues.length - nonNull.length,
      uniqueCount: unique.length,
    }
  })

  // Build a rich semantic description for the embedding model
  const colDescriptions = stats.map((s) => {
    const examples = s.sampleValues.map(String).join(', ')
    const nullNote = s.nullCount > 0 ? `, ${s.nullCount} nulls` : ''
    return `"${s.name}" (${s.type}, ${s.uniqueCount} unique values${nullNote}): e.g. ${examples || 'no examples'}`
  })

  const semanticDescription = [
    `Table with ${rows.length} rows and ${columns.length} columns.`,
    ...colDescriptions,
  ].join(' | ')

  return { columns: stats, rowCount: rows.length, semanticDescription }
}
