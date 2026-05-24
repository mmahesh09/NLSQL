# QueryAI — Natural Language to SQL

Upload a CSV, Excel, JSON, or SQL file and ask questions in plain English. Kaveri converts your questions to precise SQL queries using AI, then returns results, explanations, and charts.

## Project Structure

```
NLSQL/
├── backend/        # FastAPI + OpenRouter AI + MCP tool-use loop
└── frontend/       # Next.js 14 App Router + Tailwind + shadcn/ui
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — marketing page with features, stats, CTA |
| `/kaveri` | Kaveri — the NL-to-SQL chat app |
| `/docs` | Documentation |
| `/blog` | Blog posts |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- An [OpenRouter](https://openrouter.ai) API key

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit backend/.env → OPENROUTER_API_KEY=sk-or-v1-...

# Start the server
uvicorn main:app --reload
# Runs at http://localhost:8000
```

### 2. Frontend

```bash
cd frontend

npm install

# Configure (optional — PostgreSQL and ChromaDB are not required)
cp .env.example .env.local
# Edit frontend/.env.local if you have PostgreSQL or ChromaDB running

npm run dev
# Runs at http://localhost:3000
```

## How It Works

1. **Upload** — Drop a CSV, Excel (.xlsx/.xls), JSON, or SQL file (up to 50 MB)
2. **Schema analysis** — Column names, types, and statistics are detected automatically
3. **Ask** — Type a question in plain English in Kaveri
4. **Tool-use agent loop** — The AI calls `get_schema`, `sample_data`, then `execute_sql`
5. **Results** — See generated SQL, a plain-English explanation, and an auto-generated chart

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, framer-motion |
| Charts | Recharts |
| Backend | FastAPI, Uvicorn, Pandas |
| AI | OpenRouter (Claude, GPT-4o, Llama 3.1, Gemini Pro, Mistral) |
| Storage | PostgreSQL (optional, graceful degradation) |
| Embeddings | ChromaDB REST API + OpenAI embeddings (optional) |

## AI Models

Kaveri supports 7 models via OpenRouter. Select from the sidebar dropdown:

| Model | Provider |
|---|---|
| Claude 3.5 Sonnet | Anthropic |
| Claude 3 Haiku | Anthropic |
| GPT-4o | OpenAI |
| GPT-4o Mini | OpenAI |
| Llama 3.1 70B | Meta |
| Gemini Pro 1.5 | Google |
| Mistral Large | Mistral |

## Guardrails

Two layers of safety are built in:

- **Input validation** — blocks off-topic questions (greetings, unrelated code, PII requests)
- **SQL safety** — blocks `DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`. Only `SELECT` queries run.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | API key from openrouter.ai |
| `DEFAULT_MODEL` | No | Default model ID (defaults to `anthropic/claude-3.5-sonnet`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | No | PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/nlsql`) |
| `OPENAI_API_KEY` | No | OpenAI key for ChromaDB embeddings |
| `CHROMA_URL` | No | ChromaDB URL (default `http://localhost:8001`) |

## Development

```bash
# Type check
cd frontend && npx tsc --noEmit

# Production build
cd frontend && npm run build

# Backend tests (if any)
cd backend && pytest
```
