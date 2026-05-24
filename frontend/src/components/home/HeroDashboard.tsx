"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import AnimatedLineChart from './AnimatedLineChart';
import { Database, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

const SQL_OUTPUT = `SELECT
  c.name,
  SUM(o.amount) as revenue,
  COUNT(*) as orders
FROM customers c
JOIN orders o
  ON c.id = o.customer_id
WHERE o.date >= '2024-01-01'
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 10;`;

const RESULTS = [
  { name: 'Acme Corp', revenue: '$284,920', orders: 142 },
  { name: 'TechFlow Inc', revenue: '$198,340', orders: 98 },
  { name: 'DataSync Ltd', revenue: '$167,200', orders: 76 },
];

const chartData = [28, 42, 35, 58, 52, 71, 63, 84, 79, 94];

export default function HeroDashboard() {
  const [typedSQL, setTypedSQL] = useState('');
  const [phase, setPhase] = useState<'typing' | 'results' | 'pause'>('typing');

  useEffect(() => {
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;
      setPhase('typing');
      setTypedSQL('');

      let i = 0;
      const typeInterval = setInterval(() => {
        if (cancelled) { clearInterval(typeInterval); return; }
        if (i < SQL_OUTPUT.length) {
          setTypedSQL(SQL_OUTPUT.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setPhase('results');
          setTimeout(() => {
            if (!cancelled) {
              setPhase('pause');
              setTimeout(runCycle, 1800);
            }
          }, 3200);
        }
      }, 22);
    };

    runCycle();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative flex items-center justify-center lg:justify-end h-full py-8 lg:py-0">
      {/* Glow behind card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />
      </div>

      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        perspective={1200}
        glareEnable
        glareMaxOpacity={0.04}
        glareColor="#06b6d4"
        glarePosition="all"
        className="w-full max-w-sm relative"
      >
        {/* ── Main SQL card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative rounded-2xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Window dots */}
          <div className="flex items-center gap-2 px-4 pt-3.5 pb-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-auto text-[10px] text-white/30 font-mono">kaveri.sql</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              connected
            </span>
          </div>

          {/* NL input */}
          <div className="px-4 pt-3">
            <div className="rounded-lg border border-white/6 bg-white/3 px-3 py-2.5">
              <p className="text-[10px] text-white/35 mb-1 font-mono">natural language →</p>
              <p className="text-sm text-white/80 leading-snug">
                Show me top 10 customers by revenue this year
              </p>
            </div>
          </div>

          {/* Generating indicator */}
          <div className="flex items-center gap-1.5 px-4 py-2">
            <Zap className="h-3 w-3 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-medium">
              {phase === 'typing' ? 'Generating SQL...' : 'Query ready · 1.2s'}
            </span>
            {phase === 'typing' && (
              <motion.span
                className="inline-flex gap-0.5 ml-1"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-cyan-400" />
                ))}
              </motion.span>
            )}
          </div>

          {/* SQL output */}
          <div className="mx-4 rounded-lg bg-black/60 border border-white/5 p-3 font-mono text-[11px] leading-relaxed min-h-[120px]">
            <pre className="text-cyan-300 whitespace-pre-wrap break-all">
              {typedSQL}
              {phase === 'typing' && (
                <motion.span
                  className="inline-block w-0.5 h-3 bg-cyan-400 ml-px align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              )}
            </pre>
          </div>

          {/* Results table */}
          <motion.div
            className="mx-4 mt-2 mb-4 rounded-lg border border-white/5 overflow-hidden"
            initial={false}
            animate={{ opacity: phase === 'results' ? 1 : 0, height: phase === 'results' ? 'auto' : 0 }}
            transition={{ duration: 0.4 }}
          >
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-white/4 text-white/40">
                  <th className="text-left px-2 py-1.5 font-medium">name</th>
                  <th className="text-right px-2 py-1.5 font-medium">revenue</th>
                  <th className="text-right px-2 py-1.5 font-medium">orders</th>
                </tr>
              </thead>
              <tbody>
                {RESULTS.map((row, i) => (
                  <motion.tr
                    key={row.name}
                    className="border-t border-white/4 text-white/70"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <td className="px-2 py-1.5">{row.name}</td>
                    <td className="px-2 py-1.5 text-right text-emerald-400 font-mono">{row.revenue}</td>
                    <td className="px-2 py-1.5 text-right font-mono">{row.orders}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Bottom status bar */}
          <div className="flex items-center gap-3 px-4 pb-3.5 pt-0 border-t border-white/5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] text-white/40">SELECT only · safe query</span>
            <span className="ml-auto text-[10px] text-white/25 font-mono">PostgreSQL 15</span>
          </div>
        </motion.div>
      </Tilt>

      {/* ── Floating metric card (top-right) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="absolute top-0 -right-2 lg:-right-10 glass rounded-xl p-3 shadow-xl w-40 border border-white/8"
        style={{ animation: 'float 7s ease-in-out infinite' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3 w-3 text-cyan-400" />
          <p className="text-[10px] text-white/40">Queries / day</p>
        </div>
        <p className="text-lg font-black text-white font-montserrat">24,891</p>
        <p className="text-[9px] text-emerald-400 mb-2">↑ 18% this week</p>
        <AnimatedLineChart data={chartData} color="#06b6d4" height={36} width={140} />
      </motion.div>

      {/* ── Floating DB card (bottom-left) ── */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute bottom-4 -left-2 lg:-left-10 glass rounded-xl p-3 shadow-xl w-40 border border-white/8"
        style={{ animation: 'float 7s ease-in-out infinite 2.5s' }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <Database className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] text-white/50 font-medium">Databases</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { name: 'PostgreSQL', color: 'bg-cyan-400' },
            { name: 'MySQL', color: 'bg-blue-400' },
            { name: 'BigQuery', color: 'bg-purple-400' },
            { name: 'MongoDB', color: 'bg-emerald-400' },
          ].map((db) => (
            <div key={db.name} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${db.color} animate-pulse-slow`} />
              <span className="text-[10px] text-white/60">{db.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
