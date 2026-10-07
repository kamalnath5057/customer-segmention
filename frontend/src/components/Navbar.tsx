import React from 'react';
import { SystemStatus } from '../types';
import { Activity, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  title: string;
  status: SystemStatus | null;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ title, status, onRefresh }) => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed top-0 right-0 left-64 z-20 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Backend:</span>
          <span className="text-emerald-400 font-semibold uppercase text-[11px] tracking-wider">
            {status?.status || 'Connecting...'}
          </span>
        </div>

        {/* Clusters Count Pill */}
        {status?.is_trained && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">{status.active_clusters} Clusters Active</span>
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          title="Refresh Data & Status"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
