'use client'

import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, Sparkles } from 'lucide-react'

const ACCEPT = {
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

interface Props {
  onFileSelected: (file: File) => void
}

export default function UploadScreen({ onFileSelected }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    maxFiles: 1,
    onDrop: (files) => { if (files[0]) onFileSelected(files[0]) },
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="flex-1 flex flex-col items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(6,182,212,0.04) 0%, transparent 65%), #000',
      }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="flex items-center gap-2 mb-10"
      >
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{
            background: 'rgba(6,182,212,0.07)',
            border: '1px solid rgba(6,182,212,0.15)',
          }}
        >
          <Sparkles size={11} className="text-cyan-400" />
          <span className="text-[11px] font-medium tracking-wider uppercase text-cyan-400/70">
            Data Analysis Workspace
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13, duration: 0.45 }}
        className="font-montserrat font-black text-white text-center tracking-tight mb-3"
        style={{ fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.1 }}
      >
        Upload your data
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.19, duration: 0.4 }}
        className="text-white/30 text-base text-center mb-14"
        style={{ maxWidth: 380 }}
      >
        Drop a dataset and Kaveri will read it, understand it, then activate your AI workspace.
      </motion.p>

      {/* Upload card — 700 × 260 */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.22, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{ width: '100%', maxWidth: 700 }}
      >
        <div
          {...getRootProps()}
          className="relative cursor-pointer group outline-none"
          style={{
            minHeight: 260,
            borderRadius: 28,
            background: isDragActive
              ? 'rgba(6,182,212,0.05)'
              : 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: isDragActive
              ? '1px solid rgba(6,182,212,0.4)'
              : '1px solid rgba(255,255,255,0.07)',
            boxShadow: isDragActive
              ? '0 0 48px rgba(6,182,212,0.1), 0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)'
              : '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 56px',
            transition: 'all 0.3s ease',
          }}
        >
          <input {...getInputProps()} />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              borderRadius: 28,
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)',
              border: '1px solid rgba(6,182,212,0.1)',
            }}
          />

          {/* Icon */}
          <motion.div
            className="mb-7"
            animate={
              isDragActive
                ? { scale: 1.15, y: -8 }
                : { y: [0, -7, 0] }
            }
            transition={
              isDragActive
                ? { duration: 0.25, ease: 'backOut' }
                : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
            }
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 20,
                background: isDragActive
                  ? 'rgba(6,182,212,0.1)'
                  : 'rgba(255,255,255,0.04)',
                border: isDragActive
                  ? '1px solid rgba(6,182,212,0.25)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isDragActive
                  ? '0 0 32px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.12)'
                  : '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <UploadCloud
                size={30}
                style={{
                  color: isDragActive ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.3s',
                }}
              />
            </div>
          </motion.div>

          {/* Text */}
          <p
            className="font-semibold text-center mb-2"
            style={{
              fontSize: 18,
              color: isDragActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.75)',
              transition: 'color 0.3s',
            }}
          >
            {isDragActive ? 'Release to upload' : 'Drop your data here'}
          </p>
          <p className="text-white/28 text-sm text-center mb-8">
            {isDragActive
              ? "We'll process your file immediately"
              : 'Upload a dataset to start asking questions'}
          </p>

          {/* Format badges */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {['.csv', '.xlsx', '.json'].map((fmt) => (
              <span
                key={fmt}
                className="font-mono text-[11px] text-white/28 px-3 py-1.5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {fmt}
              </span>
            ))}
            <span className="text-white/18 text-[11px] ml-1">· max 50 MB</span>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[11px] text-center select-none mt-7"
        style={{ color: 'rgba(255,255,255,0.14)' }}
      >
        Your data is processed securely and never stored permanently
      </motion.p>
    </motion.div>
  )
}
