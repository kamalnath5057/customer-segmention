import React from 'react';
import {
  Home,
  LayoutDashboard,
  Database,
  PieChart,
  Users,
  BarChart3,
  UserCheck,
  Table,
  Lightbulb,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTrained: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isTrained }) => {
  const menuItems = [
    { id: 'landing', label: 'Home / Overview', icon: Home },
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'dataset', label: 'Dataset & Cleaning', icon: Database },
    { id: 'elbow', label: 'K-Means Studio', icon: PieChart },
    { id: 'clusters', label: 'Customer Clusters', icon: Users, badge: isTrained ? 'Active' : null },
    { id: 'visualizations', label: 'Visualizations Suite', icon: BarChart3 },
    { id: 'predictor', label: 'Segment Predictor', icon: UserCheck },
    { id: 'table', label: 'Customer Table', icon: Table },
    { id: 'insights', label: 'Business Insights', icon: Lightbulb },
    { id: 'report', label: 'Viva & Project Report', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-screen fixed left-0 top-0 bottom-0 z-30 transition-all">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide leading-tight">SegmentAI</h1>
            <p className="text-xs text-blue-400 font-medium">K-Means Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/95 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {!item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ML Model Engine</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Scikit-Learn K-Means v1.3 with StandardScaler Preprocessing
        </p>
      </div>
    </aside>
  );
};
