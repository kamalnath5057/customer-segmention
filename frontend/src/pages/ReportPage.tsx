import React from 'react';
import { FileText, BookOpen, CheckCircle2, Award, Sparkles, Database, Layers } from 'lucide-react';

export const ReportPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mini Project & Viva Documentation</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Project Report: Customer Segmentation Using K-Means Clustering
        </h1>

        <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Domain: <strong>Machine Learning & Business Analytics</strong></span>
          <span>Algorithm: <strong>K-Means Clustering (Unsupervised)</strong></span>
          <span>Stack: <strong>React, Python Flask, Scikit-learn, SQLite</strong></span>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center">1</span>
            Project Overview
          </h2>
          <p>
            Customer segmentation is the strategic practice of dividing a company’s target market into discrete groups based on shared characteristics, behaviors, and financial patterns. This project delivers an enterprise-grade web application that leverages unsupervised Machine Learning—specifically the K-Means clustering algorithm—to automatically group customers without pre-existing manual labels.
          </p>
        </section>

        {/* Section 2 */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center">2</span>
            Problem Statement & Objectives
          </h2>
          <p>
            Modern e-commerce and retail platforms process thousands of customer transactions daily. Traditional broad-spectrum marketing approaches fail because generic offers produce low conversion rates and waste budget on uninterested segments.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs pl-2">
            <li>Partition customer population into homogeneous clusters using multi-feature similarity.</li>
            <li>Eliminate manual heuristic bias by utilizing mathematical centroid distance optimization.</li>
            <li>Provide real-time predictions and targeted marketing recommendations for newly acquired customers.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center">3</span>
            Dataset Description & Features
          </h2>
          <p>
            The project operates on a dataset containing 550 synthetic customer profiles engineered to mirror real-world consumer demographics and transactional behavior:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-0.5">Demographics</strong>
              <span className="text-slate-400">CustomerID, Age (18–70), Gender (Male/Female)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-0.5">Financial Metrics</strong>
              <span className="text-slate-400">Annual Income ($k), Spending Score (1–100 index)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-0.5">Purchasing Patterns</strong>
              <span className="text-slate-400">Purchase Frequency (orders/yr), Average Purchase Value ($)</span>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center">4</span>
            Data Preprocessing & StandardScaler
          </h2>
          <p>
            Raw numerical features exhibit vastly different scales (e.g., Age 18–70 vs Annual Income $15k–$140k). To prevent large-scale attributes from dominating Euclidean distance metrics, features are standardized using Z-Score scaling:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs text-blue-400">
            z = (x - μ) / σ
          </div>
          <p className="text-xs text-slate-400">
            Where μ represents column mean and σ represents standard deviation, normalizing all 5 continuous features to mean=0 and variance=1.
          </p>
        </section>

        {/* Section 5 */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center">5</span>
            K-Means Algorithm & Elbow Method
          </h2>
          <p>
            K-Means minimizes the Within-Cluster Sum of Squares (WCSS) through iterative centroid recalculation:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs text-emerald-400">
            WCSS = ∑ (x_i - μ_k)^2
          </div>
          <p className="text-xs text-slate-400">
            The Elbow Method calculates WCSS for K=2 to 10. The optimal number of clusters is identified at the inflection point where additional cluster partitioning yields diminishing returns in WCSS reduction.
          </p>
        </section>

        {/* Section 6 */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center">6</span>
            Conclusion & Future Enhancements
          </h2>
          <p>
            The customer segmentation platform successfully converts raw demographic data into actionable marketing personas.
          </p>
          <div className="space-y-1.5 text-xs text-slate-400 pt-1">
            <p><strong>Future Enhancements:</strong></p>
            <p>• Integration with real-time transactional Webhooks & Kafka streams.</p>
            <p>• Support for Hierarchical Clustering (Dendrograms) and DBSCAN density clustering.</p>
            <p>• Automated email promotional campaign triggers via SendGrid integration.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
