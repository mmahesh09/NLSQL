import { cn } from '@/lib/utils'

interface DottedBackgroundProps {
  className?: string
  children?: React.ReactNode
  dotColor?: string
  dotSize?: number
  gap?: number
}

export function DottedBackground({
  className,
  children,
  dotColor = 'currentColor',
  dotSize = 1,
  gap = 20,
}: DottedBackgroundProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent 0)`,
        backgroundSize: `${gap}px ${gap}px`,
      }}
    >
      {children}
    </div>
  )
}
