import type { FinanceData, FinancialRatios, FinanceRecord } from "@/types";

// --- Old format helpers (records = quarters, keys = items) ---

function num(record: FinanceRecord, ...keys: string[]): number {
  for (const key of keys) {
    const val = record[key];
    if (val !== null && val !== undefined && typeof val === "number") return val;
  }
  return 0;
}

// --- New format helpers (records = items, keys = quarters like "2026-Q1") ---

function isNewFormat(records: FinanceRecord[]): boolean {
  return records.length > 0 && "item_id" in records[0];
}

function getQuarterColumns(records: FinanceRecord[]): string[] {
  if (!records.length) return [];
  return Object.keys(records[0])
    .filter((k) => /^\d{4}-Q\d$/.test(k))
    .sort()
    .reverse();
}

function parseQuarter(key: string): { year: number; quarter: number } {
  const match = key.match(/^(\d{4})-Q(\d)$/);
  if (!match) return { year: 0, quarter: 0 };
  return { year: parseInt(match[1]), quarter: parseInt(match[2]) };
}

function findItem(records: FinanceRecord[], ...keywords: string[]): FinanceRecord | undefined {
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    const exact = records.find((r) => String(r.item_en || "").toLowerCase() === lower);
    if (exact) return exact;
  }
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    const partial = records.find((r) => String(r.item_en || "").toLowerCase().includes(lower));
    if (partial) return partial;
  }
  return undefined;
}

function itemVal(record: FinanceRecord | undefined, quarterKey: string): number {
  if (!record) return 0;
  const val = record[quarterKey];
  return typeof val === "number" ? val : 0;
}

// --- Ratio computation ---

function pct(numerator: number, denominator: number): number | null {
  if (!denominator) return null;
  return +((numerator / denominator) * 100).toFixed(2);
}

function computeFromNewFormat(data: FinanceData): FinancialRatios[] {
  const { incomeStatement, balanceSheet } = data;
  const quarters = getQuarterColumns(incomeStatement);
  if (!quarters.length) return [];

  const isBank = incomeStatement.some(
    (r) => String(r.item_en || "").toLowerCase() === "net interest income",
  );

  const revenueRow = isBank
    ? findItem(incomeStatement, "total operating income", "interest and similar income")
    : findItem(incomeStatement, "net revenue", "net sales", "revenue");
  const grossProfitRow = isBank
    ? findItem(incomeStatement, "net interest income")
    : (findItem(incomeStatement, "gross profit") ??
       findItem(incomeStatement, "gross insurance"));
  const operatingProfitRow = isBank
    ? (findItem(incomeStatement, "net operating profit before allowance") ??
       findItem(incomeStatement, "total operating income"))
    : findItem(incomeStatement, "net operating profit", "operating profit");
  const netProfitRow = findItem(incomeStatement, "net profit", "profit after tax", "net income");

  const totalAssetsRow = findItem(balanceSheet, "total assets");
  const equityRow = findItem(balanceSheet, "owner's equity", "total owner's equity", "equity");

  const toBil = (v: number) => v / 1e9;

  return quarters.map((qKey) => {
    const { year, quarter } = parseQuarter(qKey);
    const revenue = toBil(itemVal(revenueRow, qKey));
    const grossProfit = toBil(itemVal(grossProfitRow, qKey));
    const operatingProfit = toBil(itemVal(operatingProfitRow, qKey));
    const netProfit = toBil(itemVal(netProfitRow, qKey));
    const totalAssets = toBil(itemVal(totalAssetsRow, qKey));
    const equity = toBil(itemVal(equityRow, qKey));

    const sameQuarterLastYear = `${year - 1}-Q${quarter}`;
    const prevRevenue = toBil(itemVal(revenueRow, sameQuarterLastYear));
    const prevNetProfit = toBil(itemVal(netProfitRow, sameQuarterLastYear));

    return {
      period: `Q${quarter}/${year}`,
      year,
      quarter,
      revenue,
      grossProfit,
      operatingProfit,
      netProfit,
      totalAssets,
      equity,
      grossMargin: pct(grossProfit, revenue),
      netMargin: pct(netProfit, revenue),
      roa: pct(netProfit, totalAssets),
      roe: pct(netProfit, equity),
      revenueGrowthYoY: prevRevenue ? pct(revenue - prevRevenue, prevRevenue) : null,
      netProfitGrowthYoY: prevNetProfit ? pct(netProfit - prevNetProfit, Math.abs(prevNetProfit)) : null,
    };
  });
}

function computeFromOldFormat(data: FinanceData): FinancialRatios[] {
  const { incomeStatement, balanceSheet } = data;

  return incomeStatement.map((is, idx) => {
    const year = num(is, "year", "yearReport") || 0;
    const quarter = num(is, "quarter", "lengthReport") || 0;
    const revenue = num(is, "revenue", "net_revenue");
    const grossProfit = num(is, "gross_profit");
    const operatingProfit = num(is, "operation_profit", "operating_profit");
    const netProfit = num(is, "net_profit", "post_tax_profit");

    const bs = balanceSheet[idx];
    const totalAssets = bs ? num(bs, "total_asset") : 0;
    const equity = bs ? num(bs, "equity", "owner_equity") : 0;

    const prev = incomeStatement.find(
      (r) => num(r, "year", "yearReport") === year - 1 && num(r, "quarter", "lengthReport") === quarter,
    );
    const prevRevenue = prev ? num(prev, "revenue", "net_revenue") : 0;
    const prevNetProfit = prev ? num(prev, "net_profit", "post_tax_profit") : 0;

    return {
      period: `Q${quarter}/${year}`,
      year,
      quarter,
      revenue,
      grossProfit,
      operatingProfit,
      netProfit,
      totalAssets,
      equity,
      grossMargin: pct(grossProfit, revenue),
      netMargin: pct(netProfit, revenue),
      roa: pct(netProfit, totalAssets),
      roe: pct(netProfit, equity),
      revenueGrowthYoY: prevRevenue ? pct(revenue - prevRevenue, prevRevenue) : null,
      netProfitGrowthYoY: prevNetProfit ? pct(netProfit - prevNetProfit, Math.abs(prevNetProfit)) : null,
    };
  });
}

export function computeFinancialRatios(data: FinanceData): FinancialRatios[] {
  if (!data.incomeStatement.length) return [];

  if (isNewFormat(data.incomeStatement)) {
    return computeFromNewFormat(data);
  }
  return computeFromOldFormat(data);
}

export function formatBillion(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)} nghìn tỷ`;
  return `${value.toFixed(1)} tỷ`;
}
