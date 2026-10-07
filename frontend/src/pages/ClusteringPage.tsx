import React, { useState, useEffect } from 'react';
import { ElbowResponse, ClusterCentroid } from '../types';
import { getElbowCurve, trainKMeansModel } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  TrendingDown,
  Play,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot
} from 'recharts';

interface ClusteringPageProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRefreshData: () => void;
}

export const ClusteringPage: React.FC<ClusteringPageProps> = ({ onNotify, onRefreshData }) => {
  const [elbowData, setElbowData] = useState<ElbowResponse | null>(null);
  const [loadingElbow, setLoadingElbow] = useState(false);
  const [selectedK, setSelectedK] = useState<number>(5);
  const [training, setTraining] = useState(false);
  const [modelResult, setModelResult] = useState<{
    inertia: number;
    centroids: ClusterCentroid[];
    k: number;
  } | null>(null);

  const fetchElbow = async () => {
    setLoadingElbow(true);
    try {
      const res = await getElbowCurve();
      setElbowData(res);
      if (res.recommended_k) {
        setSelectedK(res.recommended_k);
      }
    } catch (err: any) {
      onNotify('Failed to calculate Elbow curve', 'error');
    } finally {
      setLoadingElbow(false);
    }
  };

  useEffect(() => {
    fetchElbow();
  }, []);

  const handleTrain = async () => {
    setTraining(true);
    try {
      const res = await trainKMeansModel(selectedK);
      setModelResult({
        inertia: res.model_info.inertia,
        centroids: res.model_info.centroids,
        k: res.model_info.k
      });
      onNotify(res.message, 'success');
      onRefreshData();
    } catch (err: any) {
      onNotify(err.response?.data?.error || 'Failed to train K-Means model', 'error');
    } finally {
      setTraining(false);
    }
  };

  const recPoint = elbowData?.elbow_curve.find((p) => p.k === elbowData.recommended_k);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Elbow Method Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-400 mb-2">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Hyperparameter Optimization</span>
            </div>
            <h2 className="text-xl font-bold text-white">Elbow Method Visualization (WCSS vs K)</h2>
            <p className="text-xs text-slate-400">Determines optimal number of clusters by observing the point of inflection.</p>
          </div>

          {elbowData && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Optimal Recommendation</span>
                <p className="text-sm font-extrabold text-white">Recommended K = {elbowData.recommended_k}</p>
              </div>
            </div>
          )}
        </div>

        {loadingElbow ? (
          <LoadingSpinner label="Calculating Within-Cluster Sum of Squares (WCSS)..." />
        ) : elbowData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={elbowData.elbow_curve} margin={{ top: 15, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="k" label={{ value: 'Number of Clusters (K)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} stroke="#64748b" />
                  <YAxis label={{ value: 'WCSS / Inertia', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(value: any) => [`WCSS: ${value}`, 'Inertia']}
                  />
                  <Line
                    type="monotone"
                    dataKey="wcss"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  {recPoint && (
                    <ReferenceDot
                      x={recPoint.k}
                      y={recPoint.wcss}
                      r={8}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Explanation box */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Elbow Rule Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {elbowData.explanation}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300">
                <span className="font-semibold block mb-0.5">Scikit-Learn Param:</span>
                KMeans(init='k-means++', n_init=10, random_state=42)
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Train Controller Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Model Trainer & Hyperparameter Controls</h3>
            <p className="text-xs text-slate-400">Select K value and execute clustering pipeline on dataset.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-300">Select Clusters (K):</label>
              <select
                value={selectedK}
                onChange={(e) => setSelectedK(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white font-bold text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
                  <option key={k} value={k}>
                    K = {k} {k === elbowData?.recommended_k ? '(Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTrain}
              disabled={training}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${training ? 'animate-spin' : ''}`} />
              <span>{training ? 'Training Model...' : 'Train K-Means Model'}</span>
            </button>
          </div>
        </div>

        {/* Model Results Banner & Centroids */}
        {modelResult && (
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-fade-in">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">K-Means Model Successfully Trained & Saved</h4>
                  <p className="text-xs text-slate-400">Artifact written to <code className="text-blue-400 font-mono">models/kmeans_model.pkl</code></p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Selected K: <strong className="text-white">{modelResult.k}</strong></span>
                <span className="text-slate-400">Inertia (WCSS): <strong className="text-emerald-400">{modelResult.inertia}</strong></span>
              </div>
            </div>

            {/* Centroids Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" />
                Cluster Centroids (Original Scale Feature Means)
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Cluster ID</th>
                      <th className="py-3 px-4">Age (yrs)</th>
                      <th className="py-3 px-4">Annual Income ($k)</th>
                      <th className="py-3 px-4">Spending Score (1-100)</th>
                      <th className="py-3 px-4">Purchase Frequency (/yr)</th>
                      <th className="py-3 px-4">Avg Purchase Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {modelResult.centroids.map((c) => (
                      <tr key={c.cluster_id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-blue-400">Cluster {c.cluster_id}</td>
                        <td className="py-3 px-4 text-slate-200">{c.age}</td>
                        <td className="py-3 px-4 text-slate-200">${c.annual_income}k</td>
                        <td className="py-3 px-4 text-slate-200">{c.spending_score}</td>
                        <td className="py-3 px-4 text-slate-200">{c.purchase_frequency}</td>
                        <td className="py-3 px-4 text-slate-200">${c.avg_purchase_value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
