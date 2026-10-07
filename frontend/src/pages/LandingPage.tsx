import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  BrainCircuit,
  Database,
  BarChart2,
  ShieldCheck,
  Zap,
  Code
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const techStack = [
    { name: 'React.js 18', category: 'Frontend UI', desc: 'Modern component-driven web framework' },
    { name: 'TypeScript', category: 'Type Safety', desc: 'Strict type contracts & IntelliSense' },
    { name: 'Tailwind CSS', category: 'Styling', desc: 'Custom glassmorphic design system' },
    { name: 'Recharts', category: 'Data Visualization', desc: 'Interactive SVG chart suite' },
    { name: 'Python Flask', category: 'Backend REST API', desc: 'Scalable Python microservices API' },
    { name: 'Scikit-learn', category: 'Machine Learning', desc: 'K-Means algorithm & StandardScaler' },
    { name: 'Pandas & NumPy', category: 'Data Processing', desc: 'High-performance tabular analytics' },
    { name: 'SQLite', category: 'Database Storage', desc: 'Lightweight relational persistence' },
  ];

  const importancePoints = [
    {
      title: 'Targeted Marketing Campaigns',
      desc: 'Deliver tailored promotional offers to specific buyer personas rather than generic broadcasts.',
      icon: Target,
    },
    {
      title: 'Customer Lifetime Value Optimization',
      desc: 'Identify premium high-spenders early and nurture high-income savers into high-frequency buyers.',
      icon: TrendingUp,
    },
    {
      title: 'Churn Prevention & Retention',
      desc: 'Detect low engagement segments in real-time and trigger automated re-engagement coupons.',
      icon: ShieldCheck,
    },
    {
      title: 'Resource Allocation Efficiency',
      desc: 'Focus marketing spend on high-ROI customer cohorts for maximum business profitability.',
      icon: Zap,
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-8 lg:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unsupervised Machine Learning System</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Customer Segmentation Using <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">K-Means Clustering</span>
          </h1>

          <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
            An end-to-end full-stack analytics engine designed to automatically cluster customers based on demographics, annual income, spending scores, purchase frequency, and transaction values using Scikit-Learn.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onStart}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-3 shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Why Customer Segmentation is Important */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Why Customer Segmentation Matters</h2>
            <p className="text-slate-400 text-sm">Strategic advantages of AI-driven customer profiling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {importancePoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl glow-card space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">
                {tech.category}
              </span>
              <h4 className="text-sm font-bold text-white pt-1">{tech.name}</h4>
              <p className="text-xs text-slate-400">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
