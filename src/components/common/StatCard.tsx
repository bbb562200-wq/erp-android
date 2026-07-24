import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple' | 'teal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendType = 'up',
  icon: Icon,
  color = 'emerald'
}) => {
  return (
    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-3 shadow-xl transition-all hover:translate-y-[-2px]">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-800/60">
          {trend && (
            <span className={`font-bold ${
              trendType === 'up' ? 'text-emerald-400' : trendType === 'down' ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
