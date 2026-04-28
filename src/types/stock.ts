export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  updatedAt: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number;
  updatedAt: string;
}

export interface StockInfo {
  symbol: string;
  companyName: string;
  exchange: string;
  industry: string;
  marketCap: number;
  pe: number;
  eps: number;
  bookValue: number;
  dividendYield: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TopStock {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface CrawlMeta {
  crawledAt: string;
  trackedSymbols: string[];
  source: string;
}
