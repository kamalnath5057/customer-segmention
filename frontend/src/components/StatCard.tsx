import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  badge
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl glow-card relative overflow-hidden flex flex-col justify-between">
      {/* Background Subtle Blur Blob */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradient}`}></div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
          {value}
        </div>
      </div>

      {subtitle && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
