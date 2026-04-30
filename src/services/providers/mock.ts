import type { MarketIndex, TopStock, StockPrice, HistoricalPrice, CrawlMeta, FinanceData, CompanyProfile } from "@/types";
import dayjs from "dayjs";
const MOCK_DELAY = 300;

function randomChange(base: number, maxPercent: number = 3): number {
  const percent = (Math.random() - 0.5) * 2 * maxPercent;
  return +(base * percent / 100).toFixed(2);
}

function generateHistorical(days: number, basePrice: number): HistoricalPrice[] {
  const data: HistoricalPrice[] = [];
  let price = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = randomChange(price, 2);
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.abs(change) * Math.random();
    const low = Math.min(open, close) - Math.abs(change) * Math.random();
    const volume = Math.floor(1_000_000 + Math.random() * 10_000_000);

    data.push({
      date: date.toISOString().split("T")[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });
    price = close;
  }
  return data;
}

const MOCK_INDICES: MarketIndex[] = [
  { name: "VN-Index", value: 1245.32, change: 5.67, changePercent: 0.46, volume: 523_000_000, updatedAt: new Date().toISOString() },
  { name: "HNX-Index", value: 228.45, change: -1.23, changePercent: -0.54, volume: 78_000_000, updatedAt: new Date().toISOString() },
  { name: "UPCOM-Index", value: 92.18, change: 0.34, changePercent: 0.37, volume: 42_000_000, updatedAt: new Date().toISOString() },
];

const MOCK_STOCKS: TopStock[] = [
  { symbol: "VNM", companyName: "Vinamilk", price: 72.5, change: 1.5, changePercent: 2.11, volume: 3_200_000 },
  { symbol: "VIC", companyName: "Vingroup", price: 42.8, change: -0.6, changePercent: -1.38, volume: 5_100_000 },
  { symbol: "VHM", companyName: "Vinhomes", price: 38.2, change: 0.8, changePercent: 2.14, volume: 4_800_000 },
  { symbol: "HPG", companyName: "Hòa Phát", price: 25.6, change: 0.4, changePercent: 1.59, volume: 12_000_000 },
  { symbol: "FPT", companyName: "FPT Corp", price: 128.5, change: 3.2, changePercent: 2.55, volume: 2_100_000 },
  { symbol: "MBB", companyName: "MB Bank", price: 27.3, change: -0.3, changePercent: -1.09, volume: 8_500_000 },
  { symbol: "MSN", companyName: "Masan Group", price: 68.9, change: -1.2, changePercent: -1.71, volume: 1_800_000 },
  { symbol: "VCB", companyName: "Vietcombank", price: 92.5, change: 1.8, changePercent: 1.98, volume: 1_500_000 },
  { symbol: "TCB", companyName: "Techcombank", price: 35.4, change: 0.6, changePercent: 1.72, volume: 6_200_000 },
  { symbol: "SSI", companyName: "SSI Securities", price: 32.1, change: -0.5, changePercent: -1.53, volume: 7_800_000 },
];

const delay = () => new Promise((r) => setTimeout(r, MOCK_DELAY));

export async function mockFetchMarketIndices(): Promise<MarketIndex[]> {
  await delay();
  return MOCK_INDICES.map((idx) => ({
    ...idx,
    change: randomChange(idx.value, 1),
    changePercent: +(randomChange(idx.value, 1) / idx.value * 100).toFixed(2),
    updatedAt: new Date().toISOString(),
  }));
}

export async function mockFetchTopGainers(): Promise<TopStock[]> {
  await delay();
  return MOCK_STOCKS
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent);
}

export async function mockFetchTopLosers(): Promise<TopStock[]> {
  await delay();
  return MOCK_STOCKS
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent);
}

export async function mockFetchTopVolume(): Promise<TopStock[]> {
  await delay();
  return [...MOCK_STOCKS].sort((a, b) => b.volume - a.volume).slice(0, 5);
}

export async function mockFetchStockPrice(symbol: string): Promise<StockPrice> {
  await delay();
  const stock = MOCK_STOCKS.find((s) => s.symbol === symbol.toUpperCase());
  if (!stock) {
    return {
      symbol: symbol.toUpperCase(),
      price: 50 + Math.random() * 100,
      change: randomChange(50, 3),
      changePercent: +(Math.random() * 6 - 3).toFixed(2),
      volume: Math.floor(1_000_000 + Math.random() * 5_000_000),
      high: 55,
      low: 48,
      open: 51,
      previousClose: 50,
      updatedAt: new Date().toISOString(),
    };
  }
  return {
    symbol: stock.symbol,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    high: +(stock.price + Math.abs(stock.change) * 1.5).toFixed(2),
    low: +(stock.price - Math.abs(stock.change) * 1.2).toFixed(2),
    open: +(stock.price - stock.change + randomChange(stock.price, 0.5)).toFixed(2),
    previousClose: +(stock.price - stock.change).toFixed(2),
    updatedAt: new Date().toISOString(),
  };
}

export async function mockFetchHistoricalPrices(symbol: string, days: number = 90): Promise<HistoricalPrice[]> {
  await delay();
  const stock = MOCK_STOCKS.find((s) => s.symbol === symbol.toUpperCase());
  const basePrice = stock ? stock.price : 50 + Math.random() * 100;
  return generateHistorical(days, basePrice * 0.9);
}

export async function mockFetchHistoricalPricesByRange(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<HistoricalPrice[]> {
  const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
  const all = await mockFetchHistoricalPrices(symbol, days);
  return all.filter((h) => h.date >= startDate && h.date <= endDate);
}

export async function mockSearchStocks(query: string): Promise<TopStock[]> {
  await delay();
  const q = query.toUpperCase();
  return MOCK_STOCKS.filter(
    (s) => s.symbol.includes(q) || s.companyName.toUpperCase().includes(q)
  );
}

export async function mockFetchMeta(): Promise<CrawlMeta> {
  await delay();
  return {
    crawledAt: new Date().toISOString(),
    trackedSymbols: MOCK_STOCKS.map((s) => s.symbol),
    source: "Mock Data",
  };
}

export async function mockFetchAllStockPrices(): Promise<StockPrice[]> {
  await delay();
  return MOCK_STOCKS.map((s) => ({
    symbol: s.symbol,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
    volume: s.volume,
    high: +(s.price + Math.abs(s.change) * 1.5).toFixed(2),
    low: +(s.price - Math.abs(s.change) * 1.2).toFixed(2),
    open: +(s.price - s.change).toFixed(2),
    previousClose: +(s.price - s.change).toFixed(2),
    updatedAt: new Date().toISOString(),
  }));
}

function generateFinanceQuarters(count: number = 16): Array<{ year: number; quarter: number }> {
  const now = new Date();
  let year = now.getFullYear();
  let quarter = Math.floor(now.getMonth() / 3);

  if (quarter === 0) {
    year -= 1;
    quarter = 4;
  }

  return Array.from({ length: count }, () => {
    const current = { year, quarter };
    quarter -= 1;
    if (quarter === 0) {
      year -= 1;
      quarter = 4;
    }
    return current;
  });
}

export async function mockFetchFinanceData(symbol: string): Promise<FinanceData> {
  await delay();
  const quarters = generateFinanceQuarters();
  return {
    symbol: symbol.toUpperCase(),
    incomeStatement: quarters.map((q) => ({
      year: q.year, quarter: q.quarter,
      revenue: 5000 + Math.random() * 3000,
      cost_of_good_sold: 3000 + Math.random() * 1500,
      gross_profit: 1500 + Math.random() * 1000,
      operation_expense: 500 + Math.random() * 300,
      operation_profit: 800 + Math.random() * 600,
      net_profit: 600 + Math.random() * 500,
    })),
    balanceSheet: quarters.map((q) => ({
      year: q.year, quarter: q.quarter,
      total_asset: 30000 + Math.random() * 10000,
      current_asset: 15000 + Math.random() * 5000,
      long_term_asset: 15000 + Math.random() * 5000,
      total_debt: 18000 + Math.random() * 5000,
      current_debt: 10000 + Math.random() * 3000,
      long_term_debt: 8000 + Math.random() * 2000,
      equity: 12000 + Math.random() * 5000,
    })),
    cashFlow: quarters.map((q) => ({
      year: q.year, quarter: q.quarter,
      from_operation: 800 + Math.random() * 600,
      from_invest: -(300 + Math.random() * 400),
      from_financial: -(200 + Math.random() * 300),
      net_cash_flow: 200 + Math.random() * 300,
    })),
    crawledAt: new Date().toISOString(),
  };
}

export async function mockFetchCompanyProfile(symbol: string): Promise<CompanyProfile> {
  await delay();
  const stock = MOCK_STOCKS.find((s) => s.symbol === symbol.toUpperCase());
  return {
    symbol: symbol.toUpperCase(),
    companyName: stock?.companyName || symbol,
    shortName: stock?.companyName || symbol,
    exchange: "HOSE",
    industry: "Sản xuất",
    sector: "Hàng tiêu dùng",
  };
}
