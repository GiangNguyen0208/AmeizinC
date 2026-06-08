// News & Investment Intelligence Types

export type Sentiment = 'positive' | 'negative' | 'neutral';
export type EnrichmentProvider = 'gemini' | 'openai' | 'local';
export type Language = 'vi' | 'en';
export type NewsCategory =
  | 'earnings'
  | 'merger'
  | 'ipo'
  | 'dividend'
  | 'regulation'
  | 'market'
  | 'economic-data'
  | 'analyst-rating'
  | 'policy'
  | 'other';

export interface NewsArticle {
  _id: string;
  title: string;
  sapo: string;
  url: string;
  source: string;
  publishedAt: string;
  titleLength: number;
  sapoLength: number;
  wordCount: number;
  paragraphCount: number;
  sentiment: Sentiment;
  sentimentScore: number; // -1 to 1
  relevanceScore: number; // 0 to 1
  topic: string[];
  tickers: string[];
  companies: string[];
  sectors: string[];
  macroTags: string[];
  policyTags: string[];
  crawledAt: string;
  enrichedAt?: string;
  enrichmentProvider?: EnrichmentProvider;
  estimatedTokens: number;
  language: Language;
  category?: string;
  author?: string;
  imageUrl?: string;
  viewCount?: number;
  disclaimer: string;
  sourceAttribution: string;
  dataRetentionDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsSource {
  _id: string;
  name: string;
  urlPattern: string;
  url: string;
  language: Language;
  reliabilityScore: number;
  investmentRelevance: number;
  category: 'financial' | 'news' | 'blog' | 'social';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnrichmentLog {
  _id: string;
  articleId: string;
  articleTitle: string;
  sourceUrl: string;
  provider: EnrichmentProvider;
  status: 'success' | 'failed' | 'skipped';
  tokensUsed: number;
  estimatedCost: number;
  processingTimeMs: number;
  errorMessage?: string;
  enrichmentData?: {
    sentiment?: Sentiment;
    sentimentScore?: number;
    relevanceScore?: number;
    topics?: string[];
    tickers?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsFilterParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'relevance' | 'sentiment';
  dateRange?: 'today' | '7d' | '30d' | 'custom';
  startDate?: string;
  endDate?: string;
  ticker?: string;
  sector?: string;
  source?: string;
  sentiment?: string;
  topic?: string;
  minRelevanceScore?: number;
  minSentimentScore?: number;
  language?: Language;
  q?: string;
}

export interface NewsListResponse {
  data: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface NewsTrendingResponse {
  trendingTickers: Array<{
    ticker: string;
    count: number;
    sentiment: number;
  }>;
  trendingSectors: Array<{ sector: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
}

export interface SentimentTimelinePoint {
  date: string;
  sentiment: number;
  articleCount: number;
}

export interface SentimentTimelineResponse {
  dates: string[];
  sentiments: number[];
  articleCounts: number[];
  relatedCompanies: string[];
}

export interface DailyBriefSection {
  title: string;
  content: string;
  articles?: NewsArticle[];
  metrics?: Record<string, unknown>;
}

export interface DailyBrief {
  _id?: string;
  date: string;
  marketSnapshot: {
    topMover: string;
    topSector: string;
    sentiment: number;
  };
  keyStories: NewsArticle[];
  macroSignals: string[];
  watchlistAlerts: Array<{
    ticker: string;
    alertType: string;
    news: NewsArticle[];
  }>;
  sectorHeat: Array<{
    sector: string;
    articleCount: number;
    sentiment: number;
  }>;
  htmlContent: string;
  textContent: string;
}

export interface SourceAnalytics {
  sourceName: string;
  totalArticles: number;
  articlesPerDay: number;
  avgTitleLength: number;
  avgSummaryLength: number;
  avgWordCount: number;
  topTopics: string[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  investmentRelevance: number;
  reliabilityScore: number;
  mostCoveredSectors: string[];
  crossTickerMentions: number;
}

export interface WatchlistNewsAlert {
  ticker: string;
  alertType: 'new-article' | 'sentiment-flip' | 'policy-news' | 'spike';
  articles: NewsArticle[];
  sentimentChange?: number;
  timestamp: string;
}

export interface NewsNotificationPreference {
  _id?: string;
  userId: string;
  ticker?: string;
  channels: ('email' | 'discord' | 'telegram' | 'in-app')[];
  alerts: {
    newArticles: boolean;
    sentimentFlip: boolean;
    policyNews: boolean;
    unusualMentions: boolean;
  };
  digestFrequency: 'realtime' | 'daily' | 'weekly';
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscordNotificationConfig {
  webhookUrl: string;
  enableDailyBrief: boolean;
  enableHighSentimentChange: boolean;
  enablePolicyNews: boolean;
  enableEarnings: boolean;
  muteWeekends: boolean;
  notificationVolume: 'low' | 'medium' | 'high';
}

export interface TelegramNotificationConfig {
  botToken: string;
  chatId: string;
  enableDailyBrief: boolean;
  enableWatchlistNews: boolean;
  enableSentimentAlerts: boolean;
  muteWeekends: boolean;
}

// Stock-News Integration
export interface StockNewsTab {
  ticker: string;
  recentNews: NewsArticle[];
  sentimentTimeline: SentimentTimelinePoint[];
  sentiment7d: number;
  sentiment30d: number;
  articleCount7d: number;
  articleCount30d: number;
  relatedCompanies: string[];
  topicDistribution: Record<string, number>;
}

// Batch Processing
export enum EnrichmentJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused',
}

export interface EnrichmentBatchJob {
  _id?: string;
  status: EnrichmentJobStatus;
  articlesTotal: number;
  articlesProcessed: number;
  articlesFailed: number;
  provider: EnrichmentProvider;
  estimatedCost: number;
  actualCost: number;
  startedAt: string;
  completedAt?: string;
  errorRate: number;
  avgProcessingTimeMs: number;
}
