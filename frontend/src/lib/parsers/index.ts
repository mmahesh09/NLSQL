import { parseCSV } from './csv'
import { parseExcel } from './excel'
import { parseJSON } from './json-file'
import { parseSQL } from './sql-file'

export interface ParsedFile {
  rows: Record<string, unknown>[]
  columns: string[]
  rawSQL?: string
}

const MIME_TO_PARSER: Record<string, (buf: ArrayBuffer) => ParsedFile> = {
  'text/csv': parseCSV,
  'application/json': parseJSON,
  'application/vnd.ms-excel': parseExcel,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': parseExcel,
  'application/sql': parseSQL,
  'text/plain': parseCSV, // .csv files sometimes arrive as text/plain
}

export async function parseFile(
  mimeType: string,
  buffer: ArrayBuffer,
  filename: string
): Promise<ParsedFile> {
  const parser = MIME_TO_PARSER[mimeType]

  if (!parser) {
    // Fall back by extension
    const ext = filename.split('.').pop()?.toLowerCase()
    if (ext === 'csv') return parseCSV(buffer)
    if (ext === 'xlsx' || ext === 'xls') return parseExcel(buffer)
    if (ext === 'json') return parseJSON(buffer)
    if (ext === 'sql') return parseSQL(buffer)
    throw new Error(`Unsupported file type: ${mimeType}`)
  }

  return parser(buffer)
}
