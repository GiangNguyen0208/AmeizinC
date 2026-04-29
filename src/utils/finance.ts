import type { FinanceData, FinancialRatios, FinanceRecord } from "@/types";

function num(record: FinanceRecord, ...keys: string[]): number {
  for (const key of keys) {
    const val = record[key];
    if (val !== null && val !== undefined && typeof val === "number") return val;
  }
  return 0;
}

function pct(numerator: number, denominator: number): number | null {
  if (!denominator) return null;
  return +((numerator / denominator) * 100).toFixed(2);
}

export function computeFinancialRatios(data: FinanceData): FinancialRatios[] {
  const { incomeStatement, balanceSheet } = data;
  if (!incomeStatement.length) return [];

  return incomeStatement.map((is, idx) => {
    const year = num(is, "year", "yearReport") || 0;
    const quarter = num(is, "quarter", "lengthReport") || 0;
    const revenue = num(is, "revenue", "net_revenue", "doanh_thu");
    const grossProfit = num(is, "gross_profit", "loi_nhuan_gop");
    const operatingProfit = num(is, "operation_profit", "operating_profit", "loi_nhuan_hoat_dong");
    const netProfit = num(is, "net_profit", "post_tax_profit", "loi_nhuan_sau_thue");

    const bs = balanceSheet[idx];
    const totalAssets = bs ? num(bs, "total_asset", "tong_tai_san") : 0;
    const equity = bs ? num(bs, "equity", "owner_equity", "von_chu_so_huu") : 0;

    const sameQuarterLastYear = incomeStatement.find(
      (r) => (num(r, "year", "yearReport") === year - 1) && (num(r, "quarter", "lengthReport") === quarter)
    );
    const prevRevenue = sameQuarterLastYear ? num(sameQuarterLastYear, "revenue", "net_revenue", "doanh_thu") : 0;
    const prevNetProfit = sameQuarterLastYear ? num(sameQuarterLastYear, "net_profit", "post_tax_profit", "loi_nhuan_sau_thue") : 0;

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

export function formatBillion(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)} nghìn tỷ`;
  return `${value.toFixed(1)} tỷ`;
}
