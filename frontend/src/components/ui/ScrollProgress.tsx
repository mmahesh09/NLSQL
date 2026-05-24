'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
  color?: string
}

export function ScrollProgress({ className, color }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={cn(
        'fixed inset-x-0 top-0 z-[1000] h-1 origin-left bg-gradient-to-r from-blue-500 to-violet-500',
        className
      )}
      style={{ scaleX, ...(color ? { background: color } : {}) }}
    />
  )
}
