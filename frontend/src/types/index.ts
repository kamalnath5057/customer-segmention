export interface Customer {
  id?: number;
  customer_id: string;
  age: number;
  gender: string;
  annual_income: number;
  spending_score: number;
  purchase_frequency: number;
  avg_purchase_value: number;
  cluster_id: number;
  segment_name: string;
}

export interface ClusterProfile {
  cluster_id: number;
  segment_name: string;
  count: number;
  percentage: number;
  avg_age: number;
  avg_income: number;
  avg_spending_score: number;
  avg_purchase_frequency: number;
  avg_purchase_value: number;
  tagline: string;
  badge_color: string;
  recommendations: string[];
}

export interface ClusterCentroid {
  cluster_id: number;
  age: number;
  annual_income: number;
  spending_score: number;
  purchase_frequency: number;
  avg_purchase_value: number;
}

export interface ElbowPoint {
  k: number;
  wcss: number;
}

export interface ElbowResponse {
  elbow_curve: ElbowPoint[];
  recommended_k: number;
  explanation: string;
}

export interface PredictionRequest {
  age: number;
  gender: string;
  annual_income: number;
  spending_score: number;
  purchase_frequency: number;
  avg_purchase_value: number;
}

export interface PredictionResult {
  predicted_cluster: number;
  segment_name: string;
  tagline: string;
  badge_color: string;
  characteristics: {
    avg_age?: number;
    avg_income?: string;
    avg_spending_score?: string;
    avg_purchase_frequency?: string;
    avg_purchase_value?: string;
  };
  recommendations: string[];
}

export interface InsightCard {
  id: number;
  title: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  description: string;
  action: string;
}

export interface BusinessInsightsResponse {
  insights: InsightCard[];
  highlights: {
    highest_spending_segment?: string;
    highest_income_segment?: string;
    largest_segment?: string;
    total_revenue_potential?: number;
  };
}

export interface DashboardDistribution {
  cluster_id: number;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ScatterPoint {
  id: string;
  age: number;
  income: number;
  spending_score: number;
  purchase_frequency: number;
  avg_purchase_value: number;
  cluster_id: number;
  segment_name: string;
}

export interface DashboardData {
  total_customers: number;
  num_clusters: number;
  avg_income: number;
  avg_spending_score: number;
  cluster_distribution: DashboardDistribution[];
  scatter_data: ScatterPoint[];
}

export interface SystemStatus {
  status: string;
  total_customers: number;
  is_trained: boolean;
  active_clusters: number;
}
