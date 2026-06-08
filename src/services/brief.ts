import axios from 'axios';
import { DailyBrief } from '@/types/news';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDailyBrief = async (): Promise<DailyBrief> => {
  const response = await apiClient.get<DailyBrief>('/brief/daily');
  return response.data;
};
