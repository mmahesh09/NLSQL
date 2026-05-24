'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2, Code2, Table2, Copy, Check, Maximize2,
  AlertTriangle, Zap, ChevronDown, ChevronUp, TrendingUp,
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { OptimizationItem, QueryResult as IQueryResult } from '../types'
import ChartDisplay from './ChartDisplay'

interface Props {
  result: IQueryResult
}

type Tab = 'table' | 'chart' | 'sql'

/* ── Cost badge ── */
const COST_CONFIG = {
  low:    { label: 'Low Cost',    dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', emoji: '🟢' },
  medium: { label: 'Medium Cost', dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)',  emoji: '🟡' },
  high:   { label: 'High Cost',   dot: 'bg-red-400',     text: 'text-red-400',     bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',   emoji: '🔴' },
}

const IMPACT_BADGE: Record<string, string> = {
  high:   'text-red-400 bg-red-400/10 border border-red-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
  low:    'text-blue-400 bg-blue-400/10 border border-blue-400/20',
}

function CostBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = COST_CONFIG[level]
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cfg.text}`}
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function OptimizationPanel({ items, gain, modified }: {
  items: OptimizationItem[]
  gain?: string | null
  modified: boolean
}) {
  const [open, setOpen] = useState(true)
  if (items.length === 0) return null

  const applied    = items.filter((i) => i.applied)
  const suggested  = items.filter((i) => !i.applied)

  return (
    <div
      className="border-t border-white/6"
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap size={11} className="text-cyan-400" />
          <span className="text-[11px] font-semibold text-white/60">
            Query Optimization
          </span>
          {applied.length > 0 && (
            <span className="rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[9px] px-1.5 py-0.5 font-mono">
              {applied.length} applied
            </span>
          )}
          {gain && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
              <TrendingUp size={10} />
              {gain} faster
            </span>
          )}
        </div>
        {open ? <ChevronUp size={12} className="text-white/30" /> : <ChevronDown size={12} className="text-white/30" />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {/* Modified SQL notice */}
              {modified && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 mb-3"
                  style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}
                >
                  <Zap size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-cyan-300/70 leading-relaxed">
                    SQL was automatically rewritten for better performance. The optimized version ran above.
                  </p>
                </div>
              )}

              {/* Applied optimizations */}
              {applied.map((item, i) => (
                <motion.div
                  key={item.rule}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}
                >
                  <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-emerald-300">{item.rule}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase ${IMPACT_BADGE[item.impact]}`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}

              {/* Suggested improvements */}
              {suggested.length > 0 && (
                <>
                  <p className="text-[9px] font-semibold text-white/22 uppercase tracking-widest pt-1">
                    Suggestions
                  </p>
                  {suggested.map((item, i) => (
                    <motion.div
                      key={item.rule}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (applied.length + i) * 0.04 }}
                      className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-white/25 text-[11px] shrink-0 mt-0.5">→</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-white/50">{item.rule}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase ${IMPACT_BADGE[item.impact]}`}>
                            {item.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/30 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Main component ── */
export default function QueryResult({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('table')
  const [copied, setCopied]       = useState(false)
  const [expanded, setExpanded]   = useState(false)

  const copySQL = async () => {
    await navigator.clipboard.writeText(result.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result.error) {
    return (
      <div
        className="mt-2 flex items-start gap-2.5 rounded-xl px-4 py-3 border border-rose-500/20"
        style={{ background: 'rgba(244,63,94,0.08)' }}
      >
        <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-rose-400 mb-0.5">Query Error</p>
          <p className="text-xs text-rose-300/70">{result.error}</p>
        </div>
      </div>
    )
  }

  const hasChart  = !!result.chart && result.chart.type !== 'none'
  const opt       = result.optimization
  const chartData = result.rows.map((row) => {
    const obj: Record<string, unknown> = {}
    result.columns.forEach((col, i) => { obj[col] = row[i] })
    return obj
  })

  const tabs: { key: Tab; label: string; icon: React.ReactNode; show: boolean }[] = [
    { key: 'table', label: `${result.row_count} rows`, icon: <Table2 size={11} />,   show: true },
    { key: 'chart', label: 'Chart',                    icon: <BarChart2 size={11} />, show: hasChart },
    { key: 'sql',   label: 'SQL',                      icon: <Code2 size={11} />,     show: true },
  ]

  return (
    <div
      className="mt-2 rounded-2xl overflow-hidden border border-white/8 shadow-lg"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center border-b border-white/6"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex flex-1">
          {tabs.filter((t) => t.show).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium transition-all ${
                activeTab === tab.key ? 'text-cyan-400' : 'text-white/35 hover:text-white/60'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.key && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-cyan-500 to-blue-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right side: cost badge + actions */}
        <div className="flex items-center gap-2 pr-3">
          {opt && <CostBadge level={opt.cost_level as 'low' | 'medium' | 'high'} />}
          {activeTab === 'sql' && (
            <button
              onClick={copySQL}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all"
              title="Copy SQL"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all"
            title="Expand"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'table' && (
            <div className="overflow-auto" style={{ maxHeight: expanded ? 480 : 240 }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {result.columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2.5 text-left font-semibold text-white/40 border-b border-white/6 whitespace-nowrap sticky top-0"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                      {(row as unknown[]).map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-white/65 whitespace-nowrap font-mono text-[11px]">
                          {cell === null || cell === undefined ? (
                            <span className="text-white/20 italic">null</span>
                          ) : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {result.rows.length === 0 && (
                    <tr>
                      <td colSpan={result.columns.length} className="text-center py-10 text-white/30 text-xs">
                        No results returned
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'chart' && hasChart && result.chart && (
            <div className="p-4">
              <ChartDisplay config={result.chart} data={chartData} />
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="overflow-auto" style={{ maxHeight: expanded ? 400 : 200 }}>
              <SyntaxHighlighter
                language="sql"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '12px',
                  background: 'transparent',
                  padding: '16px',
                }}
              >
                {result.sql}
              </SyntaxHighlighter>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer row count */}
      {activeTab === 'table' && (
        <div className="flex items-center px-4 py-2 border-t border-white/5">
          <span className="text-[10px] text-white/25 font-mono">
            {result.row_count} rows returned
          </span>
        </div>
      )}

      {/* Optimization panel */}
      {opt && (
        <OptimizationPanel
          items={opt.optimizations}
          gain={opt.performance_gain}
          modified={opt.was_modified}
        />
      )}
    </div>
  )
}
