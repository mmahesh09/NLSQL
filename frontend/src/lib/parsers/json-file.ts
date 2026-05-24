import type { ParsedFile } from './index'

export function parseJSON(buffer: ArrayBuffer): ParsedFile {
  const text = new TextDecoder().decode(buffer)
  const parsed: unknown = JSON.parse(text)

  // Array of objects
  if (Array.isArray(parsed) && parsed.length > 0) {
    const columns = Object.keys(parsed[0] as object)
    return { rows: parsed as Record<string, unknown>[], columns }
  }

  // Object whose first array-valued key contains the records
  if (parsed !== null && typeof parsed === 'object') {
    for (const key of Object.keys(parsed as object)) {
      const val = (parsed as Record<string, unknown>)[key]
      if (Array.isArray(val) && val.length > 0) {
        const columns = Object.keys(val[0] as object)
        return { rows: val as Record<string, unknown>[], columns }
      }
    }
  }

  throw new Error('JSON must be an array of objects, or an object containing an array of records')
}
