"use client";
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';

interface CountUpStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export default function CountUpStat({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  duration = 2.5,
}: CountUpStatProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          end={value}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          duration={duration}
          separator=","
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
