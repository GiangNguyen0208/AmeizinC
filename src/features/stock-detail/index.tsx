"use client";

import { Button, Card, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  PriceHeader,
  FinancialRatiosCard,
  FinancialStatements,
  CompanyProfileCard,
  QuarterFinancialDetail,
} from "./components";
import { PeriodFilter, PeriodFilterValue } from "./components/PeriodFilter";
import { PriceChart } from "@/components/charts/PriceChart";
import { FinanceTrendChart } from "@/components/charts/FinanceTrendChart";
import { useStockPrice, useHistoricalPrices, useFinanceData, useCompanyProfile } from "@/hooks";
import { LoadingState, ErrorState } from "@/components/ui";
import { computeFinancialRatios, exportSectionsToCSV } from "@/utils";
import type { CSVSection } from "@/utils";
import type { CompanyProfile, FinanceData, FinanceRecord, FinancialRatios, HistoricalPrice, StockPrice } from "@/types";

const { Title } = Typography;

const DEFAULT_FILTER: PeriodFilterValue = { mode: "preset", days: 90 };
const SKIP_STATEMENT_KEYS = new Set(["year", "yearReport", "quarter", "lengthReport", "symbol", "ticker"]);

const STATEMENT_LABELS: Record<keyof Pick<FinanceData, "incomeStatement" | "balanceSheet" | "cashFlow">, string> = {
  incomeStatement: "Báo cáo KQKD",
  balanceSheet: "Bảng CĐKT",
  cashFlow: "Báo cáo LCTT",
};

interface StockDetailProps {
  symbol: string;
}

function isNewStatementFormat(records: FinanceRecord[]): boolean {
  return records.length > 0 && "item_id" in records[0];
}

function getQuarterColumns(records: FinanceRecord[]): string[] {
  if (!records.length) return [];
  return Object.keys(records[0])
    .filter((key) => /^\d{4}-Q\d$/.test(key))
    .sort()
    .reverse();
}

function formatQuarterLabel(key: string): string {
  const match = key.match(/^(\d{4})-Q(\d)$/);
  if (!match) return key;
  return `Q${match[2]}/${match[1]}`;
}

function getPeriodLabel(record: FinanceRecord): string {
  const year = record.year || record.yearReport || "";
  const quarter = record.quarter || record.lengthReport || "";
  return quarter ? `Q${quarter}/${year}` : `${year}`;
}

function createStatementSection(
  title: string,
  records: FinanceRecord[],
): CSVSection | null {
  if (!records.length) return null;

  if (isNewStatementFormat(records)) {
    const quarters = getQuarterColumns(records);
    return {
      title: `${title} - Đơn vị: tỷ đồng`,
      headers: ["Chỉ tiêu", ...quarters.map(formatQuarterLabel)],
      rows: records.map((record, idx) => [
        String(record.item || record.item_en || record.item_id || idx),
        ...quarters.map((quarter) => record[quarter]),
      ]),
    };
  }

  const keys = Object.keys(records[0]).filter((key) => !SKIP_STATEMENT_KEYS.has(key));
  return {
    title: `${title} - Đơn vị: tỷ đồng`,
    headers: ["Chỉ tiêu", ...records.map(getPeriodLabel)],
    rows: keys.map((key) => [
      key,
      ...records.map((record) => record[key]),
    ]),
  };
}

function handleExportStockDetail({
  price,
  history,
  ratios,
  financeData,
  companyProfile,
}: {
  price: StockPrice;
  history?: HistoricalPrice[];
  ratios: FinancialRatios[];
  financeData?: FinanceData;
  companyProfile?: CompanyProfile;
}) {
  const sections: CSVSection[] = [
    {
      title: "Giá hiện tại",
      headers: ["Chỉ tiêu", "Giá trị"],
      rows: [
        ["Mã CK", price.symbol],
        ["Giá", price.price],
        ["Thay đổi", price.change],
        ["% thay đổi", price.changePercent],
        ["Khối lượng", price.volume],
        ["Mở cửa", price.open],
        ["Cao nhất", price.high],
        ["Thấp nhất", price.low],
        ["Đóng cửa trước", price.previousClose],
        ["Cập nhật", price.updatedAt],
      ],
    },
    ...(companyProfile
      ? [{
          title: "Thông tin công ty",
          headers: ["Trường", "Giá trị"],
          rows: Object.entries(companyProfile)
            .filter(([, value]) => value !== undefined && value !== "")
            .map(([key, value]) => [key, value]),
        }]
      : []),
    ...(history?.length
      ? [{
          title: "Lịch sử giá",
          headers: ["Ngày", "Mở cửa", "Cao nhất", "Thấp nhất", "Đóng cửa", "Khối lượng"],
          rows: history.map((item) => [item.date, item.open, item.high, item.low, item.close, item.volume]),
        }]
      : []),
    ...(ratios.length
      ? [{
          title: "Chỉ số tài chính - Đơn vị: tỷ đồng",
          headers: [
            "Kỳ",
            "Doanh thu",
            "Lợi nhuận gộp",
            "LN hoạt động",
            "LNST",
            "Tổng tài sản",
            "Vốn CSH",
            "Biên LN gộp (%)",
            "Biên LN ròng (%)",
            "ROA (%)",
            "ROE (%)",
            "Tăng trưởng DT YoY (%)",
            "Tăng trưởng LNST YoY (%)",
          ],
          rows: ratios.map((ratio) => [
            ratio.period,
            ratio.revenue,
            ratio.grossProfit,
            ratio.operatingProfit,
            ratio.netProfit,
            ratio.totalAssets,
            ratio.equity,
            ratio.grossMargin,
            ratio.netMargin,
            ratio.roa,
            ratio.roe,
            ratio.revenueGrowthYoY,
            ratio.netProfitGrowthYoY,
          ]),
        }]
      : []),
  ];

  if (financeData) {
    for (const key of Object.keys(STATEMENT_LABELS) as Array<keyof typeof STATEMENT_LABELS>) {
      const section = createStatementSection(STATEMENT_LABELS[key], financeData[key]);
      if (section) sections.push(section);
    }
  }

  exportSectionsToCSV(
    `ameizin-${price.symbol}-detail-${new Date().toISOString().split("T")[0]}.csv`,
    sections,
  );
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [filter, setFilter] = useState<PeriodFilterValue>(DEFAULT_FILTER);
  const [selectedFinancePeriod, setSelectedFinancePeriod] = useState<string>();

  const { data: price, isLoading: loadingPrice, error: priceError, refetch } = useStockPrice(symbol);
  const { data: history, isLoading: loadingHistory } = useHistoricalPrices(symbol, filter);
  const { data: financeData, isLoading: loadingFinance } = useFinanceData(symbol);
  const { data: companyProfile } = useCompanyProfile(symbol);

  if (loadingPrice) {
    return <LoadingState />;
  }
  if (priceError) {
    return <ErrorState message="Không tìm thấy mã cổ phiếu" onRetry={refetch} />;
  }
  if (!price) {
    return null;
  }

  const ratios = financeData ? computeFinancialRatios(financeData) : [];

  return (
    <div className="space-y-6">
      <PriceHeader data={price} />

      <div className="flex justify-end">
        <Button
          icon={<DownloadOutlined />}
          onClick={() =>
            handleExportStockDetail({
              price,
              history,
              ratios,
              financeData,
              companyProfile,
            })
          }
          disabled={loadingHistory || loadingFinance}
        >
          Export CSV
        </Button>
      </div>

      {companyProfile && <CompanyProfileCard profile={companyProfile} />}

      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Title level={5} style={{ color: "#fff", margin: 0 }}>
            Biểu đồ giá — {symbol}
          </Title>

          <PeriodFilter value={filter} onChange={setFilter} />
        </div>

        {loadingHistory ? (
          <LoadingState tip="Đang tải biểu đồ..." />
        ) : history ? (
          <PriceChart data={history} />
        ) : null}
      </Card>

      {loadingFinance ? (
        <LoadingState tip="Đang tải dữ liệu tài chính..." />
      ) : financeData ? (
        <>
          {ratios.length > 0 && (
            <>
              <FinancialRatiosCard ratios={ratios} />
              <Card>
                <Title level={5} style={{ color: "#fff", margin: 0, marginBottom: 16 }}>
                  Xu hướng Doanh thu & Lợi nhuận
                </Title>
                <FinanceTrendChart ratios={ratios} onSelectPeriod={setSelectedFinancePeriod} />
                <QuarterFinancialDetail
                  ratios={ratios}
                  selectedPeriod={selectedFinancePeriod}
                  onSelectPeriod={setSelectedFinancePeriod}
                />
              </Card>
            </>
          )}
          <FinancialStatements data={financeData} />
        </>
      ) : null}
    </div>
  );
}
