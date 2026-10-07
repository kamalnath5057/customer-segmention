import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DatasetPage } from './pages/DatasetPage';
import { ClusteringPage } from './pages/ClusteringPage';
import { SegmentsPage } from './pages/SegmentsPage';
import { VisualizationsPage } from './pages/VisualizationsPage';
import { PredictorPage } from './pages/PredictorPage';
import { CustomerTablePage } from './pages/CustomerTablePage';
import { InsightsPage } from './pages/InsightsPage';
import { ReportPage } from './pages/ReportPage';
import { getSystemStatus, getDashboardData } from './services/api';
import { SystemStatus, DashboardData } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const fetchStatus = async () => {
    try {
      const res = await getSystemStatus();
      setStatus(res);
    } catch (err) {
      console.error('API connection error:', err);
    }
  };

  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const refreshAll = () => {
    fetchStatus();
    fetchDashboard();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const pageTitles: Record<string, string> = {
    landing: 'Customer Segmentation System Overview',
    dashboard: 'Executive Analytics Dashboard',
    dataset: 'Dataset Ingestion & Cleaning',
    elbow: 'K-Means Studio & Hyperparameter Tuning',
    clusters: 'Customer Segments & Persona Profiles',
    visualizations: 'High-Dimensional Visualizations Suite',
    predictor: 'Real-Time Customer Segment Predictor',
    table: 'Customer Database Table Explorer',
    insights: 'Automated Executive Business Insights',
    report: 'Project Documentation & Viva Report',
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTrained={status?.is_trained || false}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          title={pageTitles[activeTab] || 'Customer Segmentation System'}
          status={status}
          onRefresh={refreshAll}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 pt-22 pb-12 overflow-y-auto">
          {activeTab === 'landing' && (
            <LandingPage onStart={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              data={dashboardData}
              loading={loadingDashboard}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetPage
              onNotify={showToast}
              onRefreshData={refreshAll}
            />
          )}

          {activeTab === 'elbow' && (
            <ClusteringPage
              onNotify={showToast}
              onRefreshData={refreshAll}
            />
          )}

          {activeTab === 'clusters' && (
            <SegmentsPage
              onNotify={showToast}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'visualizations' && (
            <VisualizationsPage />
          )}

          {activeTab === 'predictor' && (
            <PredictorPage onNotify={showToast} />
          )}

          {activeTab === 'table' && (
            <CustomerTablePage onNotify={showToast} />
          )}

          {activeTab === 'insights' && (
            <InsightsPage onNotify={showToast} />
          )}

          {activeTab === 'report' && (
            <ReportPage />
          )}
        </main>
      </div>

      {/* Global Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
