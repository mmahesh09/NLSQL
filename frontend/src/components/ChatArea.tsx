'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, UploadCloud, BarChart3, FileText,
  Paperclip, ArrowUp, Sparkles,
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Conversation } from '../types'
import MessageBubble from './MessageBubble'

interface ChatAreaProps {
  conversation: Conversation | null
  isLoading: boolean
  onSendMessage: (question: string) => void
  onUploadFile: (file: File) => void
}

const EXAMPLE_PROMPTS = [
  { emoji: '📊', title: 'Top 10 rows',    desc: 'Show me the top 10 rows sorted by value' },
  { emoji: '📈', title: 'Summarize data', desc: 'What is the average and total for each category?' },
  { emoji: '🔍', title: 'Filter records', desc: 'List all records where status is active' },
  { emoji: '🧮', title: 'Group by month', desc: 'Show monthly totals grouped by category' },
]

const ACCEPT = {
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

export default function ChatArea({ conversation, isLoading, onSendMessage, onUploadFile }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = input.trim()
    if (!q || isLoading || !conversation?.sessionId) return
    onSendMessage(q)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    maxFiles: 1,
    noClick: true,
    onDrop: (files) => { if (files[0]) onUploadFile(files[0]) },
  })

  const hasSession = !!conversation?.sessionId
  const msgCount = conversation?.messages.length ?? 0
  /* Show example prompts only after the welcome message, before any user question */
  const showPrompts = msgCount === 1 && hasSession

  /* ── Input bar — always visible in chat phase ── */
  const inputBar = (
    <div className="shrink-0 px-6 pb-6 pt-3">
      <div style={{ maxWidth: 850, margin: '0 auto' }}>
        <motion.div
          animate={{
            boxShadow: hasSession
              ? '0 0 0 1px rgba(6,182,212,0.18), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 24,
            border: hasSession
              ? '1px solid rgba(6,182,212,0.18)'
              : '1px solid rgba(255,255,255,0.07)',
            minHeight: 110,
          }}
          className="relative transition-all duration-300"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasSession ? 'Ask your data anything...' : 'Upload a file to start asking questions'}
            disabled={!hasSession || isLoading}
            rows={1}
            className="w-full bg-transparent text-white placeholder-white/20 text-[15px] leading-7 px-6 pt-5 pb-16 outline-none resize-none disabled:cursor-not-allowed"
            style={{ maxHeight: 160, minHeight: 80 }}
          />

          <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-4 pb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 p-2 rounded-xl text-white/25 hover:text-white/60 hover:bg-white/6 transition-all"
              title="Upload new file"
            >
              <Paperclip size={15} />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] text-white/15 hidden sm:block select-none">
                Shift+Enter for newline
              </span>
              <motion.button
                whileHover={input.trim() && hasSession && !isLoading ? { scale: 1.06 } : {}}
                whileTap={input.trim() && hasSession && !isLoading ? { scale: 0.94 } : {}}
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading || !hasSession}
                className="flex items-center gap-1.5 rounded-2xl px-5 py-2 text-[13px] font-semibold transition-all"
                style={
                  input.trim() && hasSession && !isLoading
                    ? {
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        boxShadow: '0 4px 16px rgba(6,182,212,0.28)',
                        color: 'white',
                      }
                    : {
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.2)',
                        cursor: 'not-allowed',
                      }
                }
              >
                {isLoading ? (
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
                    ))}
                  </motion.div>
                ) : (
                  <>
                    <ArrowUp size={14} />
                    Send
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Action chips */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-full border border-white/8 px-3.5 py-1.5 text-[12px] font-medium text-white/40 hover:text-white hover:border-cyan-500/25 transition-all"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <UploadCloud size={12} className="text-cyan-400" />
            Upload File
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 rounded-full border border-white/8 px-3.5 py-1.5 text-[12px] font-medium text-white/40 hover:text-white hover:border-indigo-500/25 transition-all"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <BarChart3 size={12} className="text-indigo-400" />
            Design Dashboard
          </motion.button>

          <div className="relative group">
            <button
              disabled
              className="flex items-center gap-1.5 rounded-full border border-white/5 px-3.5 py-1.5 text-[12px] font-medium text-white/20 cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <FileText size={12} />
              Report Generation
              <span className="ml-1 rounded-full bg-white/8 px-1.5 py-0.5 text-[9px] text-white/25 font-mono">
                Soon
              </span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
              <div className="rounded-xl border border-white/10 bg-black/90 px-3 py-2 text-[11px] text-white/55 whitespace-nowrap shadow-2xl backdrop-blur-sm">
                AI report generation coming soon
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) { onUploadFile(f); e.target.value = '' }
          }}
          className="hidden"
        />
      </div>

      <p className="text-center text-[11px] mt-4 select-none" style={{ color: 'rgba(255,255,255,0.1)' }}>
        Kaveri may make mistakes · verify critical queries before running
      </p>
    </div>
  )

  return (
    <div
      {...getRootProps()}
      className="flex-1 flex flex-col relative overflow-hidden bg-black"
    >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col relative overflow-hidden"
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center m-4 rounded-3xl border-2 border-dashed border-cyan-500/35"
            style={{ background: 'rgba(6,182,212,0.04)', backdropFilter: 'blur(8px)' }}
          >
            <div className="text-center">
              <UploadCloud size={48} className="text-cyan-400 mx-auto mb-4" />
              <p className="text-lg font-bold text-white">Drop to upload new file</p>
              <p className="text-sm text-white/35 mt-1.5">CSV · Excel · JSON</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input {...getInputProps()} />

      {/* Chat header */}
      <div
        className="shrink-0 flex items-center gap-3 px-6 py-3.5 border-b border-white/5"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)' }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            boxShadow: '0 2px 12px rgba(6,182,212,0.22)',
          }}
        >
          <Database size={14} className="text-white" />
        </div>
        <span className="font-semibold text-white/70 text-sm truncate flex-1">
          {conversation?.title ?? 'Kaveri AI'}
        </span>
        {conversation?.uploadedFile && (
          <span
            className="text-[11px] text-cyan-400 px-3 py-1 rounded-full font-medium shrink-0"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
          >
            {conversation.uploadedFile}
          </span>
        )}
        {hasSession && (
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-8 px-6">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <AnimatePresence initial={false}>
            {conversation?.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="mb-7"
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Example prompts — shown after welcome msg, before first user question */}
          <AnimatePresence>
            {showPrompts && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="mt-8 mb-2"
              >
                <p className="text-white/25 text-[11px] font-medium uppercase tracking-widest mb-4 text-center">
                  Try asking
                </p>
                <div
                  className="grid grid-cols-2 gap-3"
                  style={{ maxWidth: 700, margin: '0 auto' }}
                >
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <motion.button
                      key={ex.title}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setInput(ex.desc); textareaRef.current?.focus() }}
                      className="text-left rounded-2xl p-5 transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                    >
                      <span className="text-2xl mb-3 block">{ex.emoji}</span>
                      <p className="font-semibold text-white/65 text-sm mb-1">{ex.title}</p>
                      <p className="text-[12px] text-white/30 leading-relaxed">{ex.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thinking indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex gap-3 items-end mt-2"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                >
                  <span className="text-white text-xs font-bold">K</span>
                </div>
                <div
                  className="rounded-2xl rounded-bl-sm px-5 py-3.5"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                    <span className="text-xs text-white/35 mr-1">Thinking</span>
                    {[0, 120, 240].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d / 1000 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {inputBar}
    </motion.div>
    </div>
  )
}
