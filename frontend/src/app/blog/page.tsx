import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const posts = [
  {
    slug: 'introducing-kaveri',
    title: 'Introducing Kaveri: Natural Language to SQL',
    excerpt:
      'Kaveri is our AI-powered SQL assistant that converts plain English questions into precise database queries. Here\'s how it works under the hood.',
    date: '2025-05-20',
    readTime: '5 min read',
    category: 'Product',
  },
  {
    slug: 'mcp-tool-use-loop',
    title: 'How We Use MCP-Style Tool Loops for Better SQL',
    excerpt:
      'Single-shot SQL generation misses context. We built a multi-turn tool-calling agent that inspects schema, samples data, and iterates to produce accurate queries.',
    date: '2025-05-15',
    readTime: '8 min read',
    category: 'Engineering',
  },
  {
    slug: 'openrouter-multi-model',
    title: 'Accessing 7 AI Models Through One API Key',
    excerpt:
      'OpenRouter gives us access to Claude, GPT-4o, Llama, Gemini, and Mistral through a single OpenAI-compatible endpoint. Here\'s how we integrated it.',
    date: '2025-05-10',
    readTime: '4 min read',
    category: 'Engineering',
  },
  {
    slug: 'guardrails-sql-safety',
    title: 'Building SQL Guardrails: Blocking Destructive Queries',
    excerpt:
      'How we implemented two-layer protection: input topic validation and SQL safety checks that block DROP, DELETE, UPDATE, and other dangerous operations.',
    date: '2025-05-05',
    readTime: '6 min read',
    category: 'Security',
  },
]

const categoryColors: Record<string, string> = {
  Product: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Engineering: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Security: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Blog</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Product updates, engineering deep-dives, and insights from the QueryAI team.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[post.category] ?? ''}`}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Read more
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
