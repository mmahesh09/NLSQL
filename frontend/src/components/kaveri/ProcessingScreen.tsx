'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Check, AlertCircle } from 'lucide-react'

const STEPS = [
  { label: 'Reading schema',        detail: 'Scanning column names and data types' },
  { label: 'Analyzing data',        detail: 'Sampling rows and value distributions' },
  { label: 'Building context',      detail: 'Mapping column relationships' },
  { label: 'Activating AI',         detail: 'Preparing your intelligent workspace' },
]

const STEP_MS = 620

interface Props {
  filename: string
  uploadDone: boolean
  uploadError: string | null
  onComplete: () => void
  onRetry: () => void
}

export default function ProcessingScreen({
  filename, uploadDone, uploadError, onComplete, onRetry,
}: Props) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set())
  const [progress, setProgress] = useState(0)
  const [animDone, setAnimDone] = useState(false)
  const [displayProgress, setDisplayProgress] = useState(0)
  const displayRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  /* ── Step animation ── */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setActiveStep(i)
        setProgress(Math.round(((i + 0.4) / STEPS.length) * 88))
      }, i * STEP_MS))

      timers.push(setTimeout(() => {
        setDoneSteps((p) => new Set(Array.from(p).concat(i)))
        setProgress(Math.round(((i + 1) / STEPS.length) * 88))
      }, (i + 0.8) * STEP_MS))
    })

    timers.push(setTimeout(() => setAnimDone(true), STEPS.length * STEP_MS))

    return () => timers.forEach(clearTimeout)
  }, [])

  /* ── Smooth progress counter ── */
  useEffect(() => {
    const target = uploadDone && animDone ? 100 : Math.min(progress, 92)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const tick = () => {
      const diff = target - displayRef.current
      if (Math.abs(diff) < 0.4) {
        displayRef.current = target
        setDisplayProgress(target)
        return
      }
      displayRef.current += diff * 0.12
      setDisplayProgress(Math.round(displayRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [progress, uploadDone, animDone])

  /* ── Fire onComplete when both done ── */
  useEffect(() => {
    if (animDone && uploadDone && !uploadError) {
      const t = setTimeout(onComplete, 750)
      return () => clearTimeout(t)
    }
  }, [animDone, uploadDone, uploadError, onComplete])

  /* ── Error state ── */
  if (uploadError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center px-4"
        style={{ background: '#000' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <AlertCircle size={30} className="text-red-400" />
        </motion.div>
        <h2 className="text-white font-bold text-xl mb-2">Upload failed</h2>
        <p className="text-white/35 text-sm mb-10 text-center" style={{ maxWidth: 340 }}>
          {uploadError}
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="px-7 py-2.5 rounded-2xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 20px rgba(6,182,212,0.25)' }}
        >
          Try again
        </motion.button>
      </motion.div>
    )
  }

  /* ── Processing state ── */
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center px-4"
      style={{ background: '#000' }}
    >
      {/* Orb */}
      <div className="relative mb-12">
        {/* Glow */}
        <motion.div
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.08, 1],
          }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -24,
            borderRadius: 44,
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 55%, #6366f1 100%)',
            boxShadow: '0 8px 40px rgba(6,182,212,0.28), 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Database size={38} className="text-white relative z-10" />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 28,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%)',
            }}
          />
        </div>

        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: 38,
            border: '1.5px solid transparent',
            borderTopColor: 'rgba(6,182,212,0.55)',
            borderRightColor: 'rgba(99,102,241,0.3)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Filename */}
      <p className="text-white/35 text-sm mb-3 text-center">
        Processing{' '}
        <span className="text-white/65 font-semibold">{filename}</span>
      </p>

      {/* Current step label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={animDone ? 'finalizing' : activeStep}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.22 }}
          className="font-semibold text-white text-xl mb-1.5 text-center"
        >
          {animDone && !uploadDone
            ? 'Finalizing...'
            : STEPS[activeStep]?.label}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={`d-${animDone ? 'f' : activeStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="text-white/28 text-sm mb-10 text-center"
        >
          {animDone && !uploadDone
            ? 'Waiting for server response...'
            : STEPS[activeStep]?.detail}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          height: 3,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        <motion.div
          style={{ height: '100%', borderRadius: 8, originX: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
        />
      </div>

      <p className="text-white/35 text-sm tabular-nums mb-10">
        {displayProgress}%
      </p>

      {/* Step list */}
      <div className="space-y-3" style={{ width: '100%', maxWidth: 290 }}>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-3.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= activeStep ? 1 : 0.28, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            {/* Step indicator */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.35s ease',
                background: doneSteps.has(i)
                  ? 'rgba(16,185,129,0.12)'
                  : i === activeStep
                  ? 'rgba(6,182,212,0.1)'
                  : 'rgba(255,255,255,0.04)',
                border: doneSteps.has(i)
                  ? '1px solid rgba(16,185,129,0.28)'
                  : i === activeStep
                  ? '1px solid rgba(6,182,212,0.22)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {doneSteps.has(i) ? (
                <Check size={12} className="text-emerald-400" />
              ) : i === activeStep ? (
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#22d3ee' }}
                />
              ) : (
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
              )}
            </div>

            <span
              className="text-sm"
              style={{
                transition: 'color 0.35s',
                color: doneSteps.has(i)
                  ? 'rgba(255,255,255,0.6)'
                  : i === activeStep
                  ? 'rgba(255,255,255,0.88)'
                  : 'rgba(255,255,255,0.22)',
              }}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
