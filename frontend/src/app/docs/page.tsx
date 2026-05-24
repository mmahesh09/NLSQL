import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, Terminal, Upload, MessageSquare, Settings, Code2 } from 'lucide-react'

const sections = [
  {
    id: 'getting-started',
    icon: BookOpen,
    title: 'Getting Started',
    content: `
Kaveri is a natural language to SQL interface built on top of QueryAI.
Upload a data file (CSV, Excel, JSON, or SQL), then ask questions in plain English.

**Quick start:**
1. Open [Kaveri](/kaveri)
2. Click the upload icon or drag & drop a file
3. Once uploaded, type your question in the chat input
4. View the generated SQL, explanation, and chart

No SQL knowledge is required. Kaveri handles everything.
    `,
  },
  {
    id: 'uploading-data',
    icon: Upload,
    title: 'Uploading Data',
    content: `
**Supported formats:**
- \`.csv\` — Comma-separated values (with or without headers)
- \`.xlsx\` / \`.xls\` — Microsoft Excel workbooks (first sheet is used)
- \`.json\` — JSON array of objects or \`{ key: [...rows] }\` shape
- \`.sql\` — SQL files with CREATE TABLE statements

**Limits:**
- Maximum file size: 50 MB
- Rows: up to 100,000 rows recommended for performance

After upload, Kaveri automatically:
- Detects column names and types (integer, float, boolean, date, text)
- Stores data in a per-session PostgreSQL table
- Generates a semantic embedding for schema-aware queries
    `,
  },
  {
    id: 'asking-questions',
    icon: MessageSquare,
    title: 'Asking Questions',
    content: `
Type any question about your data in the chat input. Examples:

- *"Show me the top 10 customers by revenue"*
- *"What is the average order value per month?"*
- *"Which products have never been ordered?"*
- *"Count distinct users by country"*

**Kaveri uses a tool-use agent loop:**
1. \`get_schema\` — reads column names and types
2. \`sample_data\` — inspects a few rows to understand values
3. \`execute_sql\` — runs the generated SELECT query

This multi-step process produces more accurate SQL than single-shot generation.
    `,
  },
  {
    id: 'model-selection',
    icon: Settings,
    title: 'Model Selection',
    content: `
Use the model dropdown in the sidebar to choose which AI model generates your SQL.

**Available models:**
| Model | Provider | Best for |
|---|---|---|
| Claude 3.5 Sonnet | Anthropic | Complex joins, nuanced queries |
| Claude 3 Haiku | Anthropic | Fast, simple queries |
| GPT-4o | OpenAI | General purpose |
| GPT-4o Mini | OpenAI | Cost-effective |
| Llama 3.1 70B | Meta | Open-source alternative |
| Gemini Pro 1.5 | Google | Large context windows |
| Mistral Large | Mistral | European data regulations |

Models are accessed via [OpenRouter](https://openrouter.ai) — one key, all models.
    `,
  },
  {
    id: 'guardrails',
    icon: Code2,
    title: 'Guardrails & Safety',
    content: `
Kaveri includes two layers of safety:

**Input guardrails** — blocks off-topic questions:
- Greetings and chitchat
- Code generation unrelated to data
- PII or personal data requests

**SQL safety checks** — blocks destructive operations:
- \`DROP TABLE\`, \`DELETE\`, \`UPDATE\`, \`INSERT\`
- \`ALTER\`, \`CREATE TABLE\`, \`TRUNCATE\`
- Any query that doesn't start with \`SELECT\` or \`WITH\`

Only read-only SELECT queries are ever executed on your data.
    `,
  },
  {
    id: 'self-hosting',
    icon: Terminal,
    title: 'Self-Hosting',
    content: `
**Prerequisites:**
- Node.js 18+
- Python 3.11+
- PostgreSQL (optional — degrades gracefully without it)
- ChromaDB (optional — embeddings skip if unavailable)

**Backend setup:**
\`\`\`bash
cd backend
python -m venv .venv
.venv/Scripts/activate   # Windows
pip install -r requirements.txt
cp .env.example .env     # add your OPENROUTER_API_KEY
uvicorn main:app --reload
\`\`\`

**Frontend setup:**
\`\`\`bash
cd frontend
npm install
cp .env.example .env.local   # set DATABASE_URL if using PostgreSQL
npm run dev
\`\`\`

Open \`http://localhost:3000\` to start using QueryAI.
    `,
  },
]

function parseContent(text: string) {
  return text
    .trim()
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-foreground mt-4 mb-1">{line.slice(2, -2)}</p>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-muted-foreground">{line.slice(2)}</li>
      }
      if (line.startsWith('| ')) {
        return null
      }
      if (line.startsWith('```')) {
        return null
      }
      if (line.trim() === '') {
        return <br key={i} />
      }
      return <p key={i} className="text-muted-foreground">{line}</p>
    })
}

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Documentation</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need to know to use QueryAI and Kaveri.
          </p>
        </div>

        {/* TOC */}
        <div className="mb-10 rounded-xl border border-border bg-muted/40 p-5">
          <p className="text-sm font-semibold text-foreground mb-3">On this page</p>
          <ul className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  → {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-14">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <section key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                </div>
                <div className="prose-sm text-muted-foreground space-y-1 border-l-2 border-border pl-4">
                  {parseContent(section.content)}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
