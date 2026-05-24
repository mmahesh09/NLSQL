'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Database, FileUp, MessageSquare,
  Plus, Sparkles, Settings, User, Upload, BookMarked, Clock, X,
} from 'lucide-react'
import { AIModel, Conversation } from '../types'
import ModelSelector from './ModelSelector'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  conversations: Conversation[]
  activeConvId: string | null
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  models: AIModel[]
  selectedModel: string
  onModelChange: (id: string) => void
}

function groupByDate(convs: Conversation[]) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: [string, Conversation[]][] = [
    ['Today', []],
    ['Yesterday', []],
    ['Older', []],
  ]

  for (const conv of convs) {
    const d = new Date(conv.createdAt)
    if (d.toDateString() === today.toDateString()) groups[0][1].push(conv)
    else if (d.toDateString() === yesterday.toDateString()) groups[1][1].push(conv)
    else groups[2][1].push(conv)
  }

  return groups
}

const sidebarStyle = {
  background: 'rgba(8,8,10,0.85)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
}

export default function Sidebar({
  isOpen, onToggle, conversations, activeConvId,
  onSelectConversation, onNewChat, models, selectedModel, onModelChange,
}: SidebarProps) {
  const [activeSection, setActiveSection] = useState<'history' | 'saved' | 'uploads'>('history')
  const groups = groupByDate(conversations)
  const recentUploads = conversations.filter(c => c.uploadedFile).slice(0, 8)

  /* ── Collapsed icon rail ── */
  if (!isOpen) {
    return (
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: 56 }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="flex flex-col items-center py-4 gap-2 shrink-0 h-full overflow-hidden"
        style={sidebarStyle}
      >
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all"
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={onNewChat}
          className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all"
          title="New Chat"
        >
          <Plus size={15} />
        </button>
        <div className="flex-1" />
        <button className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/8 transition-all" title="Settings">
          <Settings size={15} />
        </button>
        <button className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/8 transition-all" title="Profile">
          <User size={15} />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ width: 56 }}
      animate={{ width: 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      className="flex flex-col h-full shrink-0 overflow-hidden"
      style={sidebarStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/25">
            <Database size={15} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">Kaveri AI</p>
            <p className="text-[10px] text-white/35 uppercase tracking-wider">NL to SQL</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/8 transition-all"
          title="Collapse"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-cyan-500/15"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
        >
          <Plus size={15} />
          <span>New Chat</span>
          <kbd className="ml-auto text-[9px] bg-white/15 rounded px-1.5 py-0.5 font-mono">⌘N</kbd>
        </motion.button>
      </div>

      {/* Model selector */}
      <ModelSelector models={models} value={selectedModel} onChange={onModelChange} />

      {/* Section tabs */}
      <div className="flex items-center gap-0.5 px-3 py-2">
        {([
          { key: 'history', label: 'History', icon: MessageSquare },
          { key: 'saved', label: 'Saved', icon: BookMarked },
          { key: 'uploads', label: 'Uploads', icon: Upload },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              activeSection === key
                ? 'bg-white/10 text-white border border-white/12'
                : 'text-white/35 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <AnimatePresence mode="wait">
          {activeSection === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {groups.map(([label, convs]) => {
                if (convs.length === 0) return null
                return (
                  <div key={label} className="mt-2">
                    <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-1">{label}</p>
                    {convs.map((conv) => (
                      <motion.button
                        key={conv.id}
                        whileHover={{ x: 2 }}
                        onClick={() => onSelectConversation(conv.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs mb-0.5 transition-all group relative ${
                          activeConvId === conv.id
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {activeConvId === conv.id && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                        )}
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageSquare size={11} className={activeConvId === conv.id ? 'text-cyan-400 shrink-0' : 'text-white/25 shrink-0'} />
                          <span className="truncate font-medium">{conv.title}</span>
                        </div>
                        {conv.uploadedFile && (
                          <div className="flex items-center gap-1 ml-5 mt-0.5">
                            <FileUp size={8} className="text-white/20 shrink-0" />
                            <span className="text-[9px] text-white/30 truncate">{conv.uploadedFile}</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )
              })}

              {conversations.length === 0 && (
                <div className="text-center px-4 mt-10">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={18} className="text-white/20" />
                  </div>
                  <p className="text-xs text-white/40 font-medium">No conversations yet</p>
                  <p className="text-[10px] text-white/20 mt-1">Start a new chat to begin</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-2"
            >
              <div className="text-center px-4 mt-10">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <BookMarked size={18} className="text-white/20" />
                </div>
                <p className="text-xs text-white/40 font-medium">No saved queries</p>
                <p className="text-[10px] text-white/20 mt-1">Pin queries to save them here</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'uploads' && (
            <motion.div
              key="uploads"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-2"
            >
              {recentUploads.length > 0 ? (
                <>
                  <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-1">
                    Recent
                  </p>
                  {recentUploads.map((conv) => (
                    <motion.button
                      key={conv.id}
                      whileHover={{ x: 2 }}
                      onClick={() => onSelectConversation(conv.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs mb-0.5 text-white/60 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                          <FileUp size={11} className="text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white/70">{conv.uploadedFile}</p>
                          <p className="text-[9px] text-white/25">{new Date(conv.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </>
              ) : (
                <div className="text-center px-4 mt-10">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Clock size={18} className="text-white/20" />
                  </div>
                  <p className="text-xs text-white/40 font-medium">No uploads yet</p>
                  <p className="text-[10px] text-white/20 mt-1">Upload a CSV, Excel or JSON file</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Settings + Profile */}
      <div className="border-t border-white/6 px-3 py-3 flex items-center gap-2">
        <button className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/6 transition-all">
          <Settings size={13} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/6 transition-all">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
            <User size={11} className="text-white" />
          </div>
        </button>
      </div>
    </motion.div>
  )
}
