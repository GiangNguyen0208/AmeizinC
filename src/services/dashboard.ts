import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardStats = async (period: 'today' | '7d' | '30d' = '7d') => {
  const response = await apiClient.get('/dashboard/dashboard-stats', {
    params: { period },
  });
  return response.data;
};
