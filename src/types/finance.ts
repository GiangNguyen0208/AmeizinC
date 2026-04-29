export interface FinanceRecord {
  [key: string]: string | number | null;
}

export interface FinanceData {
  symbol: string;
  incomeStatement: FinanceRecord[];
  balanceSheet: FinanceRecord[];
  cashFlow: FinanceRecord[];
  crawledAt: string;
}

export interface FinancialRatios {
  period: string;
  year: number;
  quarter: number;
  revenue: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
  totalAssets: number;
  equity: number;
  grossMargin: number | null;
  netMargin: number | null;
  roa: number | null;
  roe: number | null;
  revenueGrowthYoY: number | null;
  netProfitGrowthYoY: number | null;
}

export interface CompanyProfile {
  symbol: string;
  companyName?: string;
  shortName?: string;
  exchange?: string;
  industry?: string;
  sector?: string;
  listingDate?: string;
  website?: string;
  overview?: string;
  employees?: number;
  [key: string]: string | number | undefined;
}
