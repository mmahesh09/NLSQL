'use client'

import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { AIModel, Conversation, Message, UploadResult } from '@/types'
import { getModels, runQuery, uploadFile } from '@/utils/api'

const AppNavbar    = dynamic(() => import('@/components/navbar/AppNavbar'),              { ssr: false })
const Sidebar      = dynamic(() => import('@/components/Sidebar'),                       { ssr: false })
const ChatArea     = dynamic(() => import('@/components/ChatArea'),                      { ssr: false })
const UploadScreen = dynamic(() => import('@/components/kaveri/UploadScreen'),           { ssr: false })
const ProcessingScreen = dynamic(() => import('@/components/kaveri/ProcessingScreen'),   { ssr: false })

const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const NAV_H = 72

type Phase = 'upload' | 'processing' | 'chat'

export default function KaveriPage() {
  /* ── Phase state ── */
  const [phase, setPhase] = useState<Phase>('upload')
  const [processingFile, setProcessingFile] = useState('')
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pendingResult, setPendingResult] = useState<UploadResult | null>(null)

  /* ── Conversation state ── */
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)

  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null

  useEffect(() => {
    getModels().then(setModels).catch(() => {})
  }, [])

  /* ── Upload file → switch to processing phase ── */
  const handleFileSelected = useCallback(async (file: File) => {
    setProcessingFile(file.name)
    setUploadDone(false)
    setUploadError(null)
    setPendingResult(null)
    setPhase('processing')

    try {
      const result = await uploadFile(file)
      setPendingResult(result)
      setUploadDone(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      toast.error(msg)
      setUploadError(msg)
    }
  }, [])

  /* ── Processing animation finished → enter chat ── */
  const handleProcessingComplete = useCallback(() => {
    if (!pendingResult) return

    const convId = uuidv4()
    const welcomeMsg: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `**${pendingResult.filename}** is ready — ${pendingResult.row_count.toLocaleString()} rows across ${pendingResult.columns.length} columns. Ask me anything about your data.`,
      timestamp: new Date(),
      uploadResult: pendingResult,
    }

    const conv: Conversation = {
      id: convId,
      title: pendingResult.filename,
      messages: [welcomeMsg],
      createdAt: new Date(),
      sessionId: pendingResult.session_id,
      uploadedFile: pendingResult.filename,
    }

    setConversations((prev) => [conv, ...prev])
    setActiveConvId(convId)
    setPhase('chat')
  }, [pendingResult])

  const handleRetry = useCallback(() => {
    setPhase('upload')
    setUploadError(null)
    setUploadDone(false)
    setPendingResult(null)
  }, [])

  /* ── New chat → back to upload ── */
  const handleNewChat = useCallback(() => {
    setPhase('upload')
    setActiveConvId(null)
    setUploadDone(false)
    setUploadError(null)
    setPendingResult(null)
  }, [])

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConvId(id)
    setPhase('chat')
  }, [])

  /* ── Upload new file from chat area ── */
  const handleChatUpload = useCallback(async (file: File) => {
    await handleFileSelected(file)
  }, [handleFileSelected])

  /* ── Send message ── */
  const handleSendMessage = useCallback(
    async (question: string) => {
      if (!activeConvId) return
      const conv = conversations.find((c) => c.id === activeConvId)
      if (!conv?.sessionId) return

      const userMsg: Message = {
        id: uuidv4(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg] } : c
        )
      )

      setIsLoading(true)
      try {
        const result = await runQuery(conv.sessionId, question, selectedModel)

        const assistantMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: result.error ?? result.explanation,
          timestamp: new Date(),
          queryResult: result,
        }

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeConvId) return c
            const base = c.uploadedFile ?? ''
            const title =
              c.title === 'New Conversation' || c.title === base
                ? base
                  ? `${base} — ${question.slice(0, 32)}`
                  : question.slice(0, 42)
                : c.title
            return { ...c, title, messages: [...c.messages, assistantMsg] }
          })
        )
      } catch {
        const errMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Something went wrong processing your query. Please try again.',
          timestamp: new Date(),
        }
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId ? { ...c, messages: [...c.messages, errMsg] } : c
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [activeConvId, conversations, selectedModel]
  )

  return (
    <div
      className="flex flex-col bg-black text-white overflow-hidden"
      style={{ height: '100dvh' }}
    >
      <AppNavbar />

      <div
        className="flex flex-1 overflow-hidden"
        style={{ paddingTop: NAV_H }}
      >
        {/* Sidebar — only visible in chat phase */}
        <AnimatePresence>
          {phase === 'chat' && (
            <motion.div
              key="sidebar"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="shrink-0 h-full"
            >
              <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((p) => !p)}
                conversations={conversations}
                activeConvId={activeConvId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
                models={models}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content — phase-driven */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {phase === 'upload' && (
              <UploadScreen
                key="upload"
                onFileSelected={handleFileSelected}
              />
            )}

            {phase === 'processing' && (
              <ProcessingScreen
                key="processing"
                filename={processingFile}
                uploadDone={uploadDone}
                uploadError={uploadError}
                onComplete={handleProcessingComplete}
                onRetry={handleRetry}
              />
            )}

            {phase === 'chat' && (
              <ChatArea
                key="chat"
                conversation={activeConversation}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onUploadFile={handleChatUpload}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
