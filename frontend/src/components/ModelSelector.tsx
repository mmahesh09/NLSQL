'use client'

import { AIModel } from '../types';

interface ModelSelectorProps {
  models: AIModel[];
  value: string;
  onChange: (modelId: string) => void;
}

const PROVIDER_STYLES: Record<string, string> = {
  Anthropic: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  OpenAI: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Meta: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Google: 'bg-red-500/10 text-red-400 border-red-500/20',
  Mistral: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  if (!models.length) return null;

  const selected = models.find((m) => m.id === value) ?? models[0];

  return (
    <div className="px-3 py-2.5 border-b border-white/6">
      <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest mb-1.5 px-1">Model</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl px-3 py-2 pr-7 text-xs font-medium text-white/70 cursor-pointer outline-none transition-all border border-white/8 hover:border-white/15 focus:border-cyan-500/40"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id} style={{ background: '#0a0a0a' }}>
              {m.name} ({m.provider})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <svg className="w-3 h-3 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {selected && (
        <span className={`inline-block mt-1.5 text-[9px] font-medium px-2 py-0.5 rounded-full border ${PROVIDER_STYLES[selected.provider] ?? 'bg-white/5 text-white/30 border-white/10'}`}>
          {selected.provider}
        </span>
      )}
    </div>
  );
}
