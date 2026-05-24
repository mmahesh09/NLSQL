"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  bars?: BarData[];
  height?: number;
  className?: string;
  showLabels?: boolean;
}

const defaultBars: BarData[] = [
  { label: 'PG', value: 92, color: '#06b6d4' },
  { label: 'MY', value: 88, color: '#3b82f6' },
  { label: 'BQ', value: 95, color: '#8b5cf6' },
  { label: 'MG', value: 80, color: '#06b6d4' },
  { label: 'SQ', value: 97, color: '#3b82f6' },
];

export default function AnimatedBarChart({
  bars = defaultBars,
  height = 64,
  className = '',
  showLabels = true,
}: AnimatedBarChartProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={`flex items-end gap-1.5 ${className}`} style={{ height }}>
      {bars.map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="relative w-full rounded-t-md overflow-hidden"
            style={{ height: height - (showLabels ? 16 : 0) }}
          >
            <motion.div
              className="absolute bottom-0 inset-x-0 rounded-t-md"
              style={{
                background: `linear-gradient(to top, ${bar.color}cc, ${bar.color}55)`,
              }}
              initial={{ height: '0%' }}
              animate={inView ? { height: `${bar.value}%` } : { height: '0%' }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          </div>
          {showLabels && (
            <span className="text-[9px] text-white/30 font-mono">{bar.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
