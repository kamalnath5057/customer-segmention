import React, { useState } from 'react';
import { PredictionResult } from '../types';
import { predictCustomerSegment } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  UserCheck,
  Sparkles,
  CheckCircle2,
  Send,
  Award,
  Zap,
  Tag
} from 'lucide-react';

interface PredictorPageProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PredictorPage: React.FC<PredictorPageProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState({
    age: 32,
    gender: 'Female',
    annual_income: 85,
    spending_score: 88,
    purchase_frequency: 30,
    avg_purchase_value: 280
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictCustomerSegment({
        age: Number(formData.age),
        gender: formData.gender,
        annual_income: Number(formData.annual_income),
        spending_score: Number(formData.spending_score),
        purchase_frequency: Number(formData.purchase_frequency),
        avg_purchase_value: Number(formData.avg_purchase_value)
      });
      setResult(res);
      onNotify('Customer Segment successfully predicted!', 'success');
    } catch (err: any) {
      onNotify(err.response?.data?.error || 'Prediction failed. Train the model first.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time Customer Segment Predictor</h2>
        <p className="text-xs text-slate-400">Classify new customer profiles into trained K-Means clusters using StandardScaler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold border-b border-slate-800 pb-3">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <span>Enter Customer Attributes</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Annual Income ($k)</span>
                <span className="text-blue-400 font-mono">${formData.annual_income}k</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Spending Score (1 - 100)</span>
                <span className="text-amber-400 font-mono">{formData.spending_score}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.spending_score}
                onChange={(e) => setFormData({ ...formData, spending_score: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Purchase Freq (/yr)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.purchase_frequency}
                  onChange={(e) => setFormData({ ...formData, purchase_frequency: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Avg Purchase ($)</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={formData.avg_purchase_value}
                  onChange={(e) => setFormData({ ...formData, avg_purchase_value: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 mt-4"
            >
              <Send className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Classifying Model...' : 'Predict Customer Segment'}</span>
            </button>
          </form>
        </div>

        {/* Prediction Results Display */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
          {loading ? (
            <LoadingSpinner label="Running Scikit-learn KMeans prediction..." />
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500 text-white">
                    Assigned Cluster {result.predicted_cluster}
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{result.segment_name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{result.tagline}</p>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Strategic Action Plan</span>
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-3 text-slate-500">
              <Tag className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">Ready for Prediction</p>
              <p className="text-xs">Adjust customer attributes on the left and click Predict.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
