import React from 'react';
import { DashboardData } from '../types';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Users,
  Layers,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid
} from 'recharts';

interface DashboardPageProps {
  data: DashboardData | null;
  loading: boolean;
  onNavigate: (tab: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const DashboardPage: React.FC<DashboardPageProps> = ({ data, loading, onNavigate }) => {
  if (loading) return <LoadingSpinner label="Loading Executive Dashboard..." />;

  if (!data) return (
    <div className="p-8 glass-panel rounded-2xl text-center space-y-4">
      <p className="text-slate-400">No dashboard metrics available.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Customers"
          value={data.total_customers.toLocaleString()}
          subtitle="Processed Records"
          icon={Users}
          gradient="bg-blue-500"
          badge="100% Validated"
        />
        <StatCard
          title="Active Clusters (K)"
          value={data.num_clusters}
          subtitle="Trained K-Means Segments"
          icon={Layers}
          gradient="bg-indigo-500"
          badge="Optimal"
        />
        <StatCard
          title="Avg Annual Income"
          value={`$${data.avg_income}k`}
          subtitle="Across All Customer Records"
          icon={DollarSign}
          gradient="bg-emerald-500"
        />
        <StatCard
          title="Avg Spending Score"
          value={`${data.avg_spending_score} / 100`}
          subtitle="Customer Engagement Index"
          icon={TrendingUp}
          gradient="bg-amber-500"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cluster Distribution Donut Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-blue-400" />
                Cluster Distribution
              </h3>
              <p className="text-xs text-slate-400">Customer breakdown per segment</p>
            </div>
            <button
              onClick={() => onNavigate('clusters')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              View Details <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.cluster_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {data.cluster_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(value: any, name: any) => [`${value} Customers`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {data.cluster_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-400 font-semibold">{item.count} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scatter Preview Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Income vs Spending Score Scatter</h3>
              <p className="text-xs text-slate-400">Cluster separation preview</p>
            </div>
            <button
              onClick={() => onNavigate('visualizations')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              Full Visualizations <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="income" name="Annual Income ($k)" unit="k" stroke="#64748b" />
                <YAxis type="number" dataKey="spending_score" name="Spending Score" stroke="#64748b" />
                <ZAxis type="number" dataKey="purchase_frequency" range={[40, 200]} name="Purchase Frequency" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(value: any, name: any) => [value, name]}
                />
                <Scatter name="Customers" data={data.scatter_data} fill="#3b82f6">
                  {data.scatter_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.cluster_id % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customer Segmentation Summary Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Segment Overview Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.cluster_distribution.map((dist, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-white" style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                  Cluster {dist.cluster_id}
                </span>
                <span className="text-xs text-slate-400 font-medium">{dist.percentage}%</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{dist.name}</h4>
              <p className="text-xs text-slate-400">{dist.count} Customers</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
