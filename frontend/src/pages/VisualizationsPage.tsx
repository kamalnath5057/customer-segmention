import React, { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { getDashboardData } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BarChart3, ScatterChart as ScatterIcon, Box } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const VisualizationsPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner label="Rendering High-Dimensional Visualizations..." />;
  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Interactive Visualizations Suite</h2>
        <p className="text-xs text-slate-400">Multi-dimensional feature analysis and cluster separation plots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Annual Income vs Spending Score */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <ScatterIcon className="w-5 h-5 text-blue-400" />
            <span>Annual Income vs Spending Score</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="income" name="Annual Income" unit="k$" stroke="#64748b" />
                <YAxis type="number" dataKey="spending_score" name="Spending Score" stroke="#64748b" />
                <ZAxis type="number" dataKey="purchase_frequency" range={[50, 150]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Scatter name="Customers" data={data.scatter_data}>
                  {data.scatter_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.cluster_id % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Age vs Spending Score */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <ScatterIcon className="w-5 h-5 text-indigo-400" />
            <span>Age vs Spending Score</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="age" name="Age" unit=" yrs" stroke="#64748b" />
                <YAxis type="number" dataKey="spending_score" name="Spending Score" stroke="#64748b" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Scatter name="Customers" data={data.scatter_data}>
                  {data.scatter_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.cluster_id % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Income vs Purchase Frequency */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <ScatterIcon className="w-5 h-5 text-emerald-400" />
            <span>Annual Income vs Purchase Frequency</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="income" name="Annual Income" unit="k$" stroke="#64748b" />
                <YAxis type="number" dataKey="purchase_frequency" name="Purchase Freq" unit="/yr" stroke="#64748b" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Scatter name="Customers" data={data.scatter_data}>
                  {data.scatter_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.cluster_id % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Cluster Population Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Cluster Population Comparison</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cluster_distribution} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="count" name="Customer Count" radius={[8, 8, 0, 0]}>
                  {data.cluster_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3D-Style Multi-Metric Bubble Plot */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <Box className="w-5 h-5 text-purple-400" />
            <span>3D-Style Multi-Feature Bubble Visualization</span>
          </div>
          <span className="text-xs text-slate-400">X: Income | Y: Spending | Bubble Size: Avg Purchase Value ($)</span>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey="income" name="Annual Income ($k)" unit="k" stroke="#64748b" />
              <YAxis type="number" dataKey="spending_score" name="Spending Score" stroke="#64748b" />
              <ZAxis type="number" dataKey="avg_purchase_value" range={[50, 400]} name="Avg Purchase ($)" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              />
              <Scatter name="Customers" data={data.scatter_data}>
                {data.scatter_data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.cluster_id % COLORS.length]} opacity={0.75} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
