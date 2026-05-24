import Papa from 'papaparse'
import type { ParsedFile } from './index'

export function parseCSV(buffer: ArrayBuffer): ParsedFile {
  const text = new TextDecoder().decode(buffer)

  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`)
  }

  const columns = result.meta.fields ?? []
  return { rows: result.data, columns }
}
