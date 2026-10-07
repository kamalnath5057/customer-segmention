import axios from 'axios';
import {
  SystemStatus,
  DashboardData,
  ElbowResponse,
  ClusterProfile,
  Customer,
  PredictionRequest,
  PredictionResult,
  BusinessInsightsResponse
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSystemStatus = async (): Promise<SystemStatus> => {
  const response = await api.get<SystemStatus>('/status');
  return response.data;
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>('/dashboard');
  return response.data;
};

export const loadSampleDataset = async (): Promise<{ message: string; total_records: number }> => {
  const response = await api.post('/upload', { use_sample: true });
  return response.data;
};

export const uploadDatasetCSV = async (file: File): Promise<{ message: string; total_records: number }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const preprocessDataset = async () => {
  const response = await api.post('/preprocess');
  return response.data;
};

export const getElbowCurve = async (): Promise<ElbowResponse> => {
  const response = await api.get<ElbowResponse>('/elbow');
  return response.data;
};

export const trainKMeansModel = async (k: number) => {
  const response = await api.post('/train', { k });
  return response.data;
};

export const getClustersSummary = async (): Promise<{ total_clusters: number; clusters: ClusterProfile[] }> => {
  const response = await api.get('/clusters');
  return response.data;
};

export const getCustomersList = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  cluster?: string;
  gender?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}): Promise<{ customers: Customer[]; total: number; page: number; limit: number; total_pages: number }> => {
  const response = await api.get('/customers', { params });
  return response.data;
};

export const predictCustomerSegment = async (data: PredictionRequest): Promise<PredictionResult> => {
  const response = await api.post<PredictionResult>('/predict', data);
  return response.data;
};

export const getBusinessInsights = async (): Promise<BusinessInsightsResponse> => {
  const response = await api.get<BusinessInsightsResponse>('/insights');
  return response.data;
};

export default api;
