import Link from 'next/link'
import {
  ArrowRight, Database, Zap, Shield, BarChart2, Brain, Search,
  CheckCircle, ArrowUpRight, Users, Activity, Lock, Code2
} from 'lucide-react'
import dynamic from 'next/dynamic'
const HomeNavbar = dynamic(() => import('@/components/navbar/AppNavbar'), { ssr: false })
import SmoothScrollProvider from '@/components/home/SmoothScrollProvider'
import HeroDashboard from '@/components/home/HeroDashboard'
import AnimatedLineChart from '@/components/home/AnimatedLineChart'
import AnimatedBarChart from '@/components/home/AnimatedBarChart'
import CountUpStat from '@/components/home/CountUpStat'
import ScrollReveal from '@/components/home/ScrollReveal'
import { CookieBanner } from '@/components/CookieBanner'

/* ─── Feature chart widgets ─────────────────────────────── */

const accuracyBars = [
  { label: 'Simple', value: 99, color: '#06b6d4' },
  { label: 'Join', value: 97, color: '#3b82f6' },
  { label: 'Aggr', value: 95, color: '#8b5cf6' },
  { label: 'CTE', value: 92, color: '#06b6d4' },
  { label: 'Window', value: 88, color: '#3b82f6' },
]

const queryVolume = [22, 38, 31, 55, 48, 67, 58, 74, 70, 89, 83, 95]
const uptimeData = [99, 99.9, 100, 99.8, 100, 100, 99.9, 100, 99.8, 100, 100, 99.9]

const dbEngines = [
  { name: 'PostgreSQL', pct: 92 },
  { name: 'MySQL', pct: 88 },
  { name: 'BigQuery', pct: 95 },
  { name: 'MongoDB', pct: 80 },
]

/* ─── Partner logos ─────────────────────────────────────── */
const partners = ['Stripe', 'Notion', 'Linear', 'Vercel', 'Supabase']

/* ─── Pricing plans ─────────────────────────────────────── */
const plans = [
  {
    name: 'Pro',
    price: '$29',
    per: '/month',
    desc: 'Perfect for individual developers and analysts.',
    features: ['1,000 queries / month', '5 database connections', 'GPT-4o + Claude', 'CSV & JSON export'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$99',
    per: '/month',
    desc: 'For teams that need collaboration and scale.',
    features: ['Unlimited queries', 'Unlimited connections', 'All 7 AI models', 'SSO & audit logs', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
]

/* ─── Footer columns ────────────────────────────────────── */
const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'API Reference', 'Templates', 'Community'],
}

/* ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      <SmoothScrollProvider />
      <HomeNavbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-[60%] h-[700px] w-[700px] rounded-full bg-cyan-500/6 blur-[130px]" />
          <div className="absolute top-40 right-0 h-[400px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left */}
            <div>
              <ScrollReveal>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 px-3.5 py-1.5 text-xs font-medium text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-slow" />
                  Natural Language → SQL · Now in Beta
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <h1 className="font-montserrat text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  Ask in plain English.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Get SQL
                  </span>{' '}
                  in seconds.
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="mt-6 text-lg text-white/45 leading-relaxed max-w-xl">
                  Convert natural language questions into optimized SQL queries instantly.
                  Simplify analytics and empower anyone to explore data — no expertise needed.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                {/* Search bar */}
                <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-3 backdrop-blur-sm max-w-xl">
                  <Search className="h-4 w-4 text-white/30 shrink-0" />
                  <span className="text-sm text-white/30 flex-1">
                    Ask a question or try an example...
                  </span>
                  <Link
                    href="/kaveri"
                    className="shrink-0 rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors"
                  >
                    Try Free
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/kaveri"
                    className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
                  >
                    Try Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/70 hover:text-white hover:border-white/20 transition-all"
                  >
                    Documentation
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                {/* Trust logos */}
                <div className="mt-10">
                  <p className="text-xs text-white/25 mb-3 uppercase tracking-wider">Trusted by teams at</p>
                  <div className="flex items-center gap-6 flex-wrap">
                    {partners.map((p) => (
                      <span key={p} className="text-sm font-semibold text-white/20 hover:text-white/40 transition-colors">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — 3D dashboard */}
            <ScrollReveal direction="left" delay={0.3}>
              <HeroDashboard />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ FUTURE QUERIES (features with animated charts) ═══ */}
      <section id="features" className="py-24 lg:py-32 border-t border-white/6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">
                Future Queries
              </p>
              <h2 className="font-montserrat text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                Experience that grows<br />with your scale.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="flex items-end">
              <p className="text-white/40 text-lg leading-relaxed">
                Design a query workflow that works for your team — streamlined data access,
                zero SQL expertise required, and enterprise-grade reliability.
              </p>
            </ScrollReveal>
          </div>

          {/* Feature grid with animated charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1: Accurate SQL */}
            <ScrollReveal delay={0.05}>
              <div className="group glass rounded-2xl p-5 hover:bg-white/6 transition-all duration-300 hover:-translate-y-0.5 h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">Accurate SQL</h3>
                <p className="text-xs text-white/40 leading-relaxed mb-4">
                  High-quality optimized queries across all complexity levels.
                </p>
                <div className="mt-auto">
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-[10px] text-white/30">Accuracy by type</span>
                    <span className="text-[10px] text-cyan-400 font-mono">avg 94%</span>
                  </div>
                  <AnimatedBarChart bars={accuracyBars} height={60} showLabels />
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 2: Multi-DB */}
            <ScrollReveal delay={0.1}>
              <div className="group glass rounded-2xl p-5 hover:bg-white/6 transition-all duration-300 hover:-translate-y-0.5 h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">Multi Database</h3>
                <p className="text-xs text-white/40 leading-relaxed mb-4">
                  PostgreSQL, MySQL, BigQuery, MongoDB and more.
                </p>
                <div className="mt-auto space-y-2">
                  {dbEngines.map((db) => (
                    <div key={db.name} className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 w-16 shrink-0">{db.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
                          style={{ width: `${db.pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/30 font-mono w-8 text-right">{db.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 3: Explain & Debug — query volume line chart */}
            <ScrollReveal delay={0.15}>
              <div className="group glass rounded-2xl p-5 hover:bg-white/6 transition-all duration-300 hover:-translate-y-0.5 h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">Explain &amp; Debug</h3>
                <p className="text-xs text-white/40 leading-relaxed mb-4">
                  Understand every query with plain-English explanations.
                </p>
                <div className="mt-auto">
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-[10px] text-white/30">Query volume</span>
                    <span className="text-[10px] text-violet-400 font-mono">↑ 23%</span>
                  </div>
                  <AnimatedLineChart
                    data={queryVolume}
                    color="#8b5cf6"
                    height={56}
                    showDots={false}
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 4: Secure & Fast — uptime chart */}
            <ScrollReveal delay={0.2}>
              <div className="group glass rounded-2xl p-5 hover:bg-white/6 transition-all duration-300 hover:-translate-y-0.5 h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">Secure &amp; Fast</h3>
                <p className="text-xs text-white/40 leading-relaxed mb-4">
                  Enterprise-ready architecture with 99.9% uptime SLA.
                </p>
                <div className="mt-auto">
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-[10px] text-white/30">Uptime (30d)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">99.9%</span>
                  </div>
                  <AnimatedLineChart
                    data={uptimeData}
                    color="#10b981"
                    height={56}
                    showDots={false}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ WHY QUERYAI ════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-3">Why us</p>
            <h2 className="font-montserrat text-3xl font-black tracking-tight text-white sm:text-4xl mb-14">
              Why they prefer QueryAI
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big stat */}
            <ScrollReveal delay={0.05} className="md:col-span-1">
              <div className="glass rounded-2xl p-8 h-full flex flex-col justify-between hover:bg-white/6 transition-all">
                <div>
                  <p className="font-montserrat text-6xl font-black text-white mb-2">
                    <CountUpStat value={10} suffix="K+" />
                  </p>
                  <p className="text-white/45 leading-snug">
                    Developers and data analysts already running on QueryAI
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-cyan-400">
                  <Users className="h-4 w-4" />
                  <span>Growing daily</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Instant results */}
            <ScrollReveal delay={0.1} className="md:col-span-1">
              <div className="glass rounded-2xl p-8 h-full hover:bg-white/6 transition-all">
                <p className="text-white/40 text-sm mb-3">Instant SQL generation</p>
                <p className="font-montserrat text-4xl font-black text-white mb-4">
                  Avg{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    1.2s
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Brain className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="text-white/30 text-sm">→</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/35 leading-relaxed">
                  From natural language input to validated SQL, ready to run on your database.
                </p>
              </div>
            </ScrollReveal>

            {/* Chart card */}
            <ScrollReveal delay={0.15} className="md:col-span-1">
              <div className="glass rounded-2xl p-6 h-full hover:bg-white/6 transition-all">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs text-white/35">Query summary</p>
                    <p className="font-montserrat text-2xl font-black text-white mt-0.5">
                      <CountUpStat value={2.4} suffix="M" decimals={1} />
                    </p>
                  </div>
                  <select className="text-[10px] bg-white/5 border border-white/8 rounded-md px-2 py-1 text-white/40">
                    <option>6 Months</option>
                  </select>
                </div>
                <div className="flex gap-3 text-[10px] text-white/30 mb-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                <AnimatedLineChart
                  data={[120, 280, 210, 450, 380, 620, 540, 780, 710, 940, 870, 1100]}
                  color="#06b6d4"
                  height={80}
                  showArea
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS (dark) ════════════════════════════════ */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-[#060d1a] border-y border-white/5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-600/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">Step by step</p>
            <h2 className="font-montserrat text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl max-w-2xl leading-tight mb-16">
              Maximize your results with QueryAI that generates.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {[
              { n: '1', title: 'Ask in natural language', desc: 'Type any question about your data using plain English. No SQL syntax or database knowledge required.' },
              { n: '2', title: 'Generate SQL automatically', desc: 'QueryAI instantly produces an optimized, validated SQL query with a plain-English explanation.' },
              { n: '3', title: 'Run and analyze results', desc: 'Execute the query, view results as a table or chart, and export or share with your team instantly.' },
            ].map((step, i) => (
              <ScrollReveal key={step.n} delay={i * 0.1}>
                <div className="flex flex-col h-full">
                  <span className="font-montserrat text-6xl font-black text-white/8 mb-4 select-none">{step.n}</span>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* SQL code preview panel */}
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl border border-white/8 bg-black/60 backdrop-blur-sm overflow-hidden shadow-2xl">
              {/* Window bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/6 bg-white/2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-white/30 font-mono">SQL Preview — live generation</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                  Running
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Input */}
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-white/25 mb-3 font-mono">Input</p>
                  <div className="rounded-lg bg-white/3 border border-white/5 px-4 py-3">
                    <p className="text-sm text-white/70 italic">
                      &ldquo;Show me monthly revenue by product category for the last quarter,
                      sorted by highest revenue first.&rdquo;
                    </p>
                  </div>
                </div>
                {/* Output */}
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-white/25 mb-3 font-mono">Generated SQL</p>
                  <pre className="font-mono text-xs leading-relaxed text-cyan-300 overflow-x-auto">
{`SELECT
  p.category,
  DATE_TRUNC('month', o.date) AS month,
  SUM(oi.quantity * oi.price) AS revenue
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.date >= NOW() - INTERVAL '3 months'
GROUP BY p.category, month
ORDER BY revenue DESC;`}
                  </pre>
                </div>
              </div>
              <div className="flex items-center gap-4 px-5 py-3 border-t border-white/5 bg-white/1">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Valid SELECT query
                </span>
                <span className="text-xs text-white/25">·</span>
                <span className="text-xs text-white/35">Estimated runtime: &lt;200ms</span>
                <span className="ml-auto flex gap-2">
                  <button className="text-[11px] text-white/40 hover:text-white transition-colors px-3 py-1 rounded border border-white/8 hover:border-white/20">
                    Explain
                  </button>
                  <button className="text-[11px] bg-cyan-500 text-black font-semibold px-3 py-1 rounded hover:bg-cyan-400 transition-colors">
                    Run Query
                  </button>
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ STATS / MISSION ════════════════════════════════════ */}
      <section id="stats" className="py-24 border-b border-white/6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">Our mission</p>
            <h2 className="font-montserrat text-3xl font-black tracking-tight text-white sm:text-4xl mb-4">
              We&apos;ve helped innovative companies
            </h2>
            <p className="text-white/40 mb-14 max-w-lg mx-auto">
              Hundreds of teams across all industries have made big improvements with QueryAI.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: 10000, suffix: '+', label: 'Active Users', desc: 'Developers & analysts', color: 'text-cyan-400' },
              { value: 2, suffix: 'M+', label: 'Queries Generated', desc: 'This year alone', color: 'text-blue-400' },
              { value: 99.9, suffix: '%', label: 'Uptime', desc: 'Enterprise SLA', color: 'text-emerald-400', decimals: 1 },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="glass rounded-2xl p-8 hover:bg-white/6 transition-all">
                  <p className={`font-montserrat text-4xl font-black mb-1 ${stat.color}`}>
                    <CountUpStat value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                  </p>
                  <p className="font-semibold text-white mb-1">{stat.label}</p>
                  <p className="text-xs text-white/35">{stat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">Choose plan</p>
            <h2 className="font-montserrat text-3xl font-black tracking-tight text-white sm:text-4xl mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-white/40">No hidden fees. Cancel anytime.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-7 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    plan.highlight
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-700 shadow-xl shadow-cyan-500/20'
                      : 'glass hover:bg-white/6'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[10px] font-bold text-cyan-600 shadow">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="font-montserrat text-xl font-black text-white mb-1">{plan.name}</h3>
                    <p className={`text-sm mb-4 ${plan.highlight ? 'text-white/70' : 'text-white/40'}`}>
                      {plan.desc}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="font-montserrat text-4xl font-black text-white">{plan.price}</span>
                      <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/60' : 'text-white/35'}`}>
                        {plan.per}
                      </span>
                    </div>
                  </div>

                  <ul className="flex-1 space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <CheckCircle className={`h-4 w-4 shrink-0 ${plan.highlight ? 'text-white/70' : 'text-cyan-400'}`} />
                        <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-white/55'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/kaveri"
                    className={`flex items-center justify-between rounded-xl px-5 py-3 text-sm font-semibold transition-all group ${
                      plan.highlight
                        ? 'bg-white text-cyan-700 hover:bg-white/90'
                        : 'border border-white/15 text-white hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#060d1a] border border-white/8 p-10 lg:p-14">
              {/* Glow orbs */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/4 top-0 h-[200px] w-[300px] rounded-full bg-cyan-500/8 blur-[80px]" />
                <div className="absolute right-1/4 bottom-0 h-[200px] w-[300px] rounded-full bg-blue-600/8 blur-[80px]" />
              </div>
              {/* Top line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">
                    Go to there
                  </p>
                  <h2 className="font-montserrat text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight mb-4">
                    Ready to unlock the power of your data?
                  </h2>
                  <p className="text-white/40 text-base leading-relaxed">
                    Supports teams of all sizes with simple onboarding, powerful AI models,
                    and real-time SQL generation tools.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:justify-end">
                  <Link
                    href="/kaveri"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/25"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/70 hover:text-white hover:border-white/25 transition-all"
                  >
                    View Documentation
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════ */}
      <footer className="border-t border-white/6 py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2.5 4h10M2.5 7.5h6M2.5 11h7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="font-montserrat text-base font-bold text-white">QueryAI</span>
              </div>
              <p className="text-xs text-white/35 leading-relaxed max-w-[160px]">
                Natural language to SQL for every team.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-5">
                {['𝕏', 'in', 'gh'].map((s) => (
                  <button
                    key={s}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 text-xs text-white/40 hover:text-white hover:border-white/20 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([col, links]) => (
              <div key={col}>
                <p className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wider">{col}</p>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-xs text-white/35 hover:text-white/70 transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/25">© QueryAI 2024. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  )
}
