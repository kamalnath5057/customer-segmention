import React, { useState, useEffect } from 'react';
import { BusinessInsightsResponse } from '../types';
import { getBusinessInsights } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Lightbulb,
  Award,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface InsightsPageProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNotify }) => {
  const [data, setData] = useState<BusinessInsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await getBusinessInsights();
        setData(res);
      } catch (err) {
        onNotify('Failed to load business insights', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) return <LoadingSpinner label="Generating AI Business Insights..." />;
  if (!data) return null;

  const iconsMap: Record<string, any> = {
    1: Award,
    2: TrendingUp,
    3: Users,
    4: AlertTriangle
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Executive Business Insights & Intelligence</h2>
        <p className="text-xs text-slate-400">Automated strategic analysis synthesized from trained cluster centroids</p>
      </div>

      {/* Highlights KPI Banner */}
      {data.highlights && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Spender Group</span>
            <p className="text-base font-extrabold text-amber-400">{data.highlights.highest_spending_segment || 'N/A'}</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Earning Group</span>
            <p className="text-base font-extrabold text-emerald-400">{data.highlights.highest_income_segment || 'N/A'}</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Largest Segment</span>
            <p className="text-base font-extrabold text-blue-400">{data.highlights.largest_segment || 'N/A'}</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est Revenue Runrate</span>
            <p className="text-base font-extrabold text-purple-400">${(data.highlights.total_revenue_potential || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Strategic Insights Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>Automated Cluster Observations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.insights.map((item) => {
            const Icon = iconsMap[item.id] || Sparkles;
            return (
              <div key={item.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 glow-card flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Insight #{item.id}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-800 text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Recommended Business Action</span>
                  </span>
                  <p className="text-xs text-slate-200 font-medium">{item.action}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
