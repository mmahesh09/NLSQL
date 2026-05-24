/**
 * Schema embedding layer — uses ChromaDB REST API + OpenAI embeddings directly
 * via fetch. No native npm packages → no webpack/ONNX bundling issues.
 *
 * Optional services (both degrade gracefully if unavailable):
 *   ChromaDB server: chroma run --path ./chroma-data --port 8001
 *   OpenAI key:      OPENAI_API_KEY  (for text-embedding-3-small)
 */

const CHROMA_URL = () => process.env.CHROMA_URL ?? 'http://localhost:8001'
const COLLECTION = 'nlsql_schemas'

// ── Embeddings via OpenAI HTTP API ───────────────────────────────────────────

async function embed(texts: string[]): Promise<number[][] | null> {
  if (!process.env.OPENAI_API_KEY) return null

  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: texts }),
    })
    if (!res.ok) return null
    const json = await res.json() as { data: { embedding: number[] }[] }
    return json.data.map((d) => d.embedding)
  } catch {
    return null
  }
}

// ── ChromaDB REST helpers ────────────────────────────────────────────────────

async function getOrCreateCollection(): Promise<string | null> {
  try {
    const res = await fetch(`${CHROMA_URL()}/api/v1/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: COLLECTION, get_or_create: true }),
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    const col = await res.json() as { id: string }
    return col.id
  } catch {
    return null
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface StoredSchema {
  sessionId: string
  filename: string
  description: string
  tableName: string
  rowCount: number
  columnCount: number
}

export async function storeSchemaEmbedding(schema: StoredSchema): Promise<void> {
  try {
    const collectionId = await getOrCreateCollection()
    if (!collectionId) return // ChromaDB not running — skip silently

    const embeddings = await embed([schema.description])

    const body: Record<string, unknown> = {
      ids: [schema.sessionId],
      documents: [schema.description],
      metadatas: [
        {
          filename: schema.filename,
          tableName: schema.tableName,
          rowCount: schema.rowCount,
          columnCount: schema.columnCount,
        },
      ],
    }
    if (embeddings) body.embeddings = embeddings

    const res = await fetch(`${CHROMA_URL()}/api/v1/collections/${collectionId}/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.warn('[embeddings] ChromaDB upsert failed:', res.status)
    }
  } catch (err) {
    console.warn('[embeddings] ChromaDB unavailable — skipping embedding storage:', err)
  }
}

export async function retrieveRelevantSchemas(
  question: string,
  nResults = 3
): Promise<{ description: string; metadata: Record<string, unknown> }[]> {
  try {
    const collectionId = await getOrCreateCollection()
    if (!collectionId) return []

    const embeddings = await embed([question])
    const body: Record<string, unknown> = { n_results: nResults }
    if (embeddings) {
      body.query_embeddings = embeddings
    } else {
      body.query_texts = [question]
    }

    const res = await fetch(`${CHROMA_URL()}/api/v1/collections/${collectionId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return []

    const data = await res.json() as {
      documents: string[][]
      metadatas: Record<string, unknown>[][]
    }

    return (data.documents[0] ?? []).map((doc, i) => ({
      description: doc,
      metadata: data.metadatas[0]?.[i] ?? {},
    }))
  } catch (err) {
    console.warn('[embeddings] ChromaDB retrieval failed:', err)
    return []
  }
}
