"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useId } from 'react';

interface AnimatedLineChartProps {
  data?: number[];
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  showDots?: boolean;
  showArea?: boolean;
  animated?: boolean;
}

export default function AnimatedLineChart({
  data = [20, 45, 30, 65, 55, 80, 70, 90, 85, 95],
  color = '#06b6d4',
  height = 60,
  width = 200,
  className = '',
  showDots = false,
  showArea = true,
  animated = true,
}: AnimatedLineChartProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const id = useId().replace(/:/g, '');

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = height * 0.1;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - padding - ((val - min) / range) * (height - padding * 2),
  }));

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + point.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${point.y} ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div ref={ref} className={className}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {showArea && (
          <motion.path
            d={areaD}
            fill={`url(#grad-${id})`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: animated ? 0.8 : 0 }}
          />
        )}

        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: animated ? 1.4 : 0, ease: 'easeOut', opacity: { duration: 0.1 } }}
        />

        {showDots &&
          points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, delay: animated ? 1.4 + i * 0.04 : 0 }}
            />
          ))}

        {/* Latest value dot */}
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: animated ? 1.5 : 0 }}
        />
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="8"
          fill={color}
          fillOpacity="0.15"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: animated ? 1.5 : 0 }}
        />
      </svg>
    </div>
  );
}
