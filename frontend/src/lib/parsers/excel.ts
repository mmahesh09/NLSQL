import * as XLSX from 'xlsx'
import type { ParsedFile } from './index'

export function parseExcel(buffer: ArrayBuffer): ParsedFile {
  const workbook = XLSX.read(buffer, { type: 'array' })

  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw new Error('Excel file contains no sheets')

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    workbook.Sheets[sheetName],
    { defval: null }
  )

  const columns = rows.length > 0 ? Object.keys(rows[0]) : []
  return { rows, columns }
}
