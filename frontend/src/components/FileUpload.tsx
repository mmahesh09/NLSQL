'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  onUpload: (file: File) => void
}

const MAX_SIZE = 50 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set(['csv', 'xlsx', 'xls', 'json', 'sql'])

function validateFile(file: File): string | null {
  if (file.size > MAX_SIZE) return 'File size must not exceed 50 MB'
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.has(ext)) return `Unsupported file type ".${ext}". Use CSV, Excel, JSON or SQL`
  return null
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast.error(error)
      return
    }
    onUpload(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-200 w-full max-w-md bg-card ${
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary hover:bg-primary/5'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <UploadCloud size={26} className="text-primary" />
      </div>
      <p className="font-semibold text-foreground mb-1 text-base">Drop your data file here</p>
      <p className="text-sm text-muted-foreground mb-5">or click to browse · max 50 MB</p>
      <div className="flex gap-2 justify-center flex-wrap">
        {['CSV', 'Excel (.xlsx)', 'JSON', 'SQL'].map((ext) => (
          <span key={ext} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-lg font-mono">
            {ext}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.json,.sql"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
