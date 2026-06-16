import axios from 'axios';
import { 
  NewsListResponse, 
  NewsFilterParams, 
  NewsTrendingResponse, 
  SentimentTimelineResponse 
} from '@/types/news';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchNews = async (params: NewsFilterParams): Promise<NewsListResponse> => {
  const response = await apiClient.get<NewsListResponse>('/news', { params });
  return response.data;
};

export const fetchNewsByTicker = async (
  ticker: string, 
  page = 1, 
  limit = 10
): Promise<NewsListResponse> => {
  const response = await apiClient.get<NewsListResponse>(`/news/by-ticker/${ticker}`, {
    params: { page, limit },
  });
  return response.data;
};

export const fetchTrendingNews = async (
  period: 'today' | '7d' | '30d' = '7d'
): Promise<NewsTrendingResponse> => {
  const response = await apiClient.get<NewsTrendingResponse>('/news/trending', {
    params: { period },
  });
  return response.data;
};

export const fetchSentimentTimeline = async (
  ticker: string,
  days = 30
): Promise<SentimentTimelineResponse> => {
  const response = await apiClient.get<SentimentTimelineResponse>(
    `/news/sentiment-timeline/${ticker}`,
    { params: { days } }
  );
  return response.data;
};
