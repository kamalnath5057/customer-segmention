import React, { useState, useEffect } from 'react';
import { ClusterProfile } from '../types';
import { getClustersSummary } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  ArrowRight
} from 'lucide-react';

interface SegmentsPageProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigate: (tab: string) => void;
}

export const SegmentsPage: React.FC<SegmentsPageProps> = ({ onNotify, onNavigate }) => {
  const [clusters, setClusters] = useState<ClusterProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const res = await getClustersSummary();
      setClusters(res.clusters);
    } catch (err: any) {
      onNotify('Failed to load customer cluster profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  if (loading) return <LoadingSpinner label="Analyzing customer clusters & profiles..." />;

  if (clusters.length === 0) {
    return (
      <div className="p-12 glass-panel rounded-2xl text-center space-y-4 max-w-lg mx-auto">
        <Users className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Clusters Found</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Please run the K-Means Model Trainer first in the K-Means Studio tab.
        </p>
        <button
          onClick={() => onNavigate('elbow')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
        >
          Go to K-Means Studio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Customer Segments & Action Plans</h2>
          <p className="text-xs text-slate-400">Dynamic segment profiles generated based on centroid characteristics</p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
          {clusters.length} Distinct Segments Identified
        </div>
      </div>

      {/* Cluster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((cluster) => (
          <div
            key={cluster.cluster_id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 glow-card flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-600 text-white shadow-sm">
                    Cluster {cluster.cluster_id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {cluster.count} Customers ({cluster.percentage}%)
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{cluster.segment_name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cluster.tagline}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Avg Income</span>
                  </div>
                  <p className="text-sm font-extrabold text-white">${cluster.avg_income}k</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                    <span>Spend Score</span>
                  </div>
                  <p className="text-sm font-extrabold text-white">{cluster.avg_spending_score} / 100</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <ShoppingBag className="w-3 h-3 text-blue-400" />
                    <span>Purchase Freq</span>
                  </div>
                  <p className="text-sm font-extrabold text-white">{cluster.avg_purchase_frequency} / yr</p>
                </div>
              </div>

              {/* Additional Secondary Stats */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Avg Age: <strong className="text-slate-200">{cluster.avg_age} yrs</strong></span>
                <span>Avg Purchase Value: <strong className="text-slate-200">${cluster.avg_purchase_value}</strong></span>
              </div>
            </div>

            {/* Recommended Marketing Strategy */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tailored Marketing Recommendations</span>
              </div>

              <div className="space-y-2">
                {cluster.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
