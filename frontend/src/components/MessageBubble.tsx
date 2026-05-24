'use client'

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Message } from '../types';
import QueryResult from './QueryResult';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end items-end">
        <div
          className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(59,130,246,0.20))', border: '1px solid rgba(6,182,212,0.2)' }}
        >
          <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{message.content}</p>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <User size={13} className="text-white/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      {/* Kaveri avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-cyan-500/20"
        style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
      >
        <span className="text-white text-xs font-bold">K</span>
      </div>

      <div className="flex-1 min-w-0 max-w-[92%]">
        {/* Text bubble */}
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-white/8"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Query results */}
        {message.queryResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <QueryResult result={message.queryResult} />
          </motion.div>
        )}

        {/* Upload result */}
        {message.uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-2 rounded-2xl px-4 py-3 border border-emerald-500/20"
            style={{ background: 'rgba(16,185,129,0.08)' }}
          >
            <p className="text-xs font-semibold text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
              {message.uploadResult.row_count.toLocaleString()} rows · {message.uploadResult.columns.length} columns detected
            </p>
            <div className="flex flex-wrap gap-1.5">
              {message.uploadResult.columns.map((col) => (
                <span
                  key={col.name}
                  className="border border-white/8 text-white/60 px-2 py-0.5 rounded-lg text-xs font-mono"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {col.name}
                  <span className="text-white/25 ml-1 text-[10px]">({col.dtype})</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
