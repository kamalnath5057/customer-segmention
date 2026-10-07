import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { loadSampleDataset, uploadDatasetCSV, preprocessDataset, getCustomersList } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  Sliders
} from 'lucide-react';

interface DatasetPageProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRefreshData: () => void;
}

export const DatasetPage: React.FC<DatasetPageProps> = ({ onNotify, onRefreshData }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preprocessingStats, setPreprocessingStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchDataset = async () => {
    setLoading(true);
    try {
      const res = await getCustomersList({ page: 1, limit: 15, search: searchTerm });
      setCustomers(res.customers);
      setTotalRecords(res.total);
    } catch (err: any) {
      onNotify('Failed to fetch dataset preview', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, [searchTerm]);

  const handleLoadSample = async () => {
    setLoading(true);
    try {
      const res = await loadSampleDataset();
      onNotify(res.message, 'success');
      await fetchDataset();
      onRefreshData();
    } catch (err: any) {
      onNotify(err.response?.data?.error || 'Failed to load sample dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      onNotify('Please select a CSV file first', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await uploadDatasetCSV(selectedFile);
      onNotify(res.message, 'success');
      setSelectedFile(null);
      await fetchDataset();
      onRefreshData();
    } catch (err: any) {
      onNotify(err.response?.data?.error || 'Failed to upload CSV file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreprocess = async () => {
    setLoading(true);
    try {
      const res = await preprocessDataset();
      setPreprocessingStats(res.stats);
      onNotify('Data Preprocessing successfully completed!', 'success');
      await fetchDataset();
      onRefreshData();
    } catch (err: any) {
      onNotify(err.response?.data?.error || 'Preprocessing failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upload & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSV Upload Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Custom CSV</h3>
              <p className="text-xs text-slate-400">Supported columns: CustomerID, Age, Gender, Income, Spending Score...</p>
            </div>
          </div>

          <form onSubmit={handleFileUpload} className="space-y-3">
            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/50 transition-colors">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs text-slate-300 font-medium">
                {selectedFile ? selectedFile.name : 'Click to select CSV file'}
              </span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              />
            </label>

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-md shadow-blue-600/20"
            >
              Upload & Ingest CSV
            </button>
          </form>
        </div>

        {/* Load Sample Dataset Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Load Sample Dataset</h3>
                <p className="text-xs text-slate-400">Pre-generated 550 customer dataset with realistic consumer profiles.</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Includes Customer ID, Age, Gender, Annual Income ($k), Spending Score (1-100), Purchase Frequency & Avg Purchase Value.
            </p>
          </div>

          <button
            onClick={handleLoadSample}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Load Sample Dataset (550 Records)
          </button>
        </div>

        {/* Preprocessing Actions Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Data Preprocessing</h3>
                <p className="text-xs text-slate-400">StandardScaler, Median Imputation & Duplicate Removal</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Impute missing values with column medians</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remove duplicate Customer IDs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standardize numerical features (Mean=0, Var=1)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePreprocess}
            disabled={totalRecords === 0 || loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-md shadow-emerald-600/20"
          >
            Run Preprocessing Pipeline
          </button>
        </div>
      </div>

      {/* Preprocessing Status Banner */}
      {preprocessingStats && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Data Preprocessing Complete</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">StandardScaler Fitted</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Initial Rows</span>
              <p className="text-base font-bold text-white">{preprocessingStats.initial_rows}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Cleaned Rows</span>
              <p className="text-base font-bold text-white">{preprocessingStats.final_rows}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Duplicates Removed</span>
              <p className="text-base font-bold text-emerald-400">{preprocessingStats.duplicates_removed}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Missing Imputed</span>
              <p className="text-base font-bold text-blue-400">{preprocessingStats.missing_values_imputed}</p>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Preview Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Dataset Preview</h3>
            <p className="text-xs text-slate-400">Showing first {customers.length} of {totalRecords} customer records</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading customer dataset preview..." />
        ) : customers.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-slate-300 font-semibold text-sm">No Customer Data Found</p>
            <p className="text-slate-500 text-xs">Click "Load Sample Dataset" above to start analyzing immediately.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Annual Income ($k)</th>
                  <th className="py-3 px-4">Spending Score (1-100)</th>
                  <th className="py-3 px-4">Purchase Freq (/yr)</th>
                  <th className="py-3 px-4">Avg Purchase ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {customers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-blue-400 font-mono font-semibold">{c.customer_id}</td>
                    <td className="py-3 px-4 text-slate-200">{c.age}</td>
                    <td className="py-3 px-4 text-slate-300">{c.gender}</td>
                    <td className="py-3 px-4 text-slate-200">${c.annual_income}k</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                        {c.spending_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">{c.purchase_frequency}</td>
                    <td className="py-3 px-4 text-slate-200">${c.avg_purchase_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
