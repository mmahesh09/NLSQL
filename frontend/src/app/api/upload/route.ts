import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const upstream = await fetch(`${BACKEND}/api/upload`, {
      method: 'POST',
      body: formData,
    })
    const body = await upstream.json()
    return NextResponse.json(body, { status: upstream.status })
  } catch (err) {
    console.error('[api/upload]', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
