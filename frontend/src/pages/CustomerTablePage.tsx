import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { getCustomersList } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Table as TableIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface CustomerTablePageProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CustomerTablePage: React.FC<CustomerTablePageProps> = ({ onNotify }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('customer_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomersList({
        page,
        limit: 12,
        search,
        cluster: clusterFilter,
        gender: genderFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      setCustomers(res.customers);
      setTotalPages(res.total_pages);
      setTotalRecords(res.total);
    } catch (err: any) {
      onNotify('Failed to load customers list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search, clusterFilter, genderFilter, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Customer Segmentation Table</h2>
          <p className="text-xs text-slate-400">Search, sort, filter, and review customer cluster assignments</p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
          Showing {totalRecords} Customer Records
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Customer ID or Segment..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Cluster Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={clusterFilter}
              onChange={(e) => {
                setClusterFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Clusters</option>
              <option value="0">Cluster 0</option>
              <option value="1">Cluster 1</option>
              <option value="2">Cluster 2</option>
              <option value="3">Cluster 3</option>
              <option value="4">Cluster 4</option>
            </select>
          </div>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Querying SQLite customer database..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('customer_id')}>
                    <div className="flex items-center gap-1">
                      <span>Customer ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('age')}>
                    <div className="flex items-center gap-1">
                      <span>Age</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('annual_income')}>
                    <div className="flex items-center gap-1">
                      <span>Income ($k)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('spending_score')}>
                    <div className="flex items-center gap-1">
                      <span>Spending Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Purchase Freq</th>
                  <th className="py-3 px-4">Avg Purchase ($)</th>
                  <th className="py-3 px-4">Cluster</th>
                  <th className="py-3 px-4">Segment Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {customers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-blue-400 font-mono font-bold">{c.customer_id}</td>
                    <td className="py-3 px-4 text-slate-200">{c.age}</td>
                    <td className="py-3 px-4 text-slate-300">{c.gender}</td>
                    <td className="py-3 px-4 text-slate-200">${c.annual_income}k</td>
                    <td className="py-3 px-4 font-semibold text-amber-400">{c.spending_score} / 100</td>
                    <td className="py-3 px-4 text-slate-200">{c.purchase_frequency} / yr</td>
                    <td className="py-3 px-4 text-slate-200">${c.avg_purchase_value}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-extrabold text-[10px] uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        C-{c.cluster_id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100">{c.segment_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
