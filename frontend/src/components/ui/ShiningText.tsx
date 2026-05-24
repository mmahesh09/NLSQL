'use client'

import { cn } from '@/lib/utils'

interface ShiningTextProps {
  text: string
  className?: string
  shimmerWidth?: number
}

export function ShiningText({ text, className, shimmerWidth = 100 }: ShiningTextProps) {
  return (
    <p
      style={{ '--shimmer-width': `${shimmerWidth}px` } as React.CSSProperties}
      className={cn(
        'mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70',
        'animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] text-transparent [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
        'bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80',
        '[background-size:var(--shimmer-width)_100%]',
        className
      )}
    >
      {text}
    </p>
  )
}
