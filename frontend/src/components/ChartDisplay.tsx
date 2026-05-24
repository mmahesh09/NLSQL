'use client'

import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend,
  LineChart, Line, PieChart, Pie, ResponsiveContainer, ScatterChart,
  Scatter, Tooltip, XAxis, YAxis,
} from 'recharts';
import { ChartConfig } from '../types';

interface ChartDisplayProps {
  config: ChartConfig;
  data: Record<string, unknown>[];
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

const AXIS_STYLE = { fontSize: 11, fill: 'rgba(255,255,255,0.35)' };
const GRID_STYLE = { stroke: 'rgba(255,255,255,0.05)', strokeDasharray: '3 3' };
const TOOLTIP_STYLE = {
  contentStyle: { background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11, color: '#fff' },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};

export default function ChartDisplay({ config, data }: ChartDisplayProps) {
  const { type, x_key, y_keys = [], title } = config;

  if (!x_key || !data.length) {
    return (
      <div className="text-center text-white/30 text-sm py-10">No chart data available</div>
    );
  }

  const sharedProps = { data, margin: { top: 8, right: 16, left: -8, bottom: 4 } };

  return (
    <div>
      {title && (
        <h3 className="text-xs font-semibold text-white/50 mb-3 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={260}>
        {type === 'bar' ? (
          <BarChart {...sharedProps}>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey={x_key} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
            {y_keys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={48} />
            ))}
          </BarChart>
        ) : type === 'line' ? (
          <LineChart {...sharedProps}>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey={x_key} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
            {y_keys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]}
                strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            ))}
          </LineChart>
        ) : type === 'area' ? (
          <AreaChart {...sharedProps}>
            <defs>
              {y_keys.map((key, i) => (
                <linearGradient key={key} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey={x_key} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
            {y_keys.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key}
                stroke={COLORS[i % COLORS.length]} fill={`url(#area-${i})`} strokeWidth={2} />
            ))}
          </AreaChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey={y_keys[0] ?? ''} nameKey={x_key}
              cx="50%" cy="50%" outerRadius={100} innerRadius={40}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: 'rgba(255,255,255,0.15)' }}
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
          </PieChart>
        ) : (
          <ScatterChart {...sharedProps}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey={x_key} type="number" name={x_key} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis dataKey={y_keys[0]} type="number" name={y_keys[0]} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill={COLORS[0]} />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
