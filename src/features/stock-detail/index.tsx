"use client";

import { Button, Card, Typography, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsByTicker } from "@/services/news";
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
import type { CompanyProfile, FinanceData, FinanceRecord, FinancialRatios, HistoricalPrice, StockPrice, NewsArticle } from "@/types";

const { Title, Text } = Typography;

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
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  const { data: price, isLoading: loadingPrice, error: priceError, refetch } = useStockPrice(symbol);
  const { data: history, isLoading: loadingHistory } = useHistoricalPrices(symbol, filter);
  const { data: financeData, isLoading: loadingFinance } = useFinanceData(symbol);
  const { data: companyProfile } = useCompanyProfile(symbol);

  // Fetch news for ticker to correlate with chart price dots
  const { data: newsData } = useQuery({
    queryKey: ["stock-news-timeline", symbol],
    queryFn: () => fetchNewsByTicker(symbol, 1, 100),
    enabled: !!symbol,
  });

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

      <div className="flex justify-stretch sm:justify-end">
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
          className="w-full sm:w-auto"
        >
          Export CSV
        </Button>
      </div>

      {companyProfile && <CompanyProfileCard profile={companyProfile} />}

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Title level={5} style={{ color: "#fff", margin: 0 }}>
              Biểu đồ giá tương quan tin tức — {symbol}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              *Các chấm tròn <span className="text-emerald-400 font-semibold">xanh</span>/<span className="text-red-400 font-semibold">đỏ</span> trên đường giá biểu thị tin tức AI có ảnh hưởng lớn. Click để xem chi tiết.
            </Text>
          </div>

          <PeriodFilter value={filter} onChange={setFilter} />
        </div>

        {loadingHistory ? (
          <LoadingState tip="Đang tải biểu đồ..." />
        ) : history ? (
          <PriceChart
            data={history}
            news={newsData?.data}
            onSelectNews={(news) => setSelectedNews(news)}
          />
        ) : null}

        {/* Selected news correlation card */}
        {selectedNews && (
          <div className="mt-4 p-5 bg-gray-900/40 rounded-xl border border-gray-800 space-y-3 relative transition-all duration-300">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white font-bold cursor-pointer border-0 bg-transparent text-sm"
            >
              ✕ Close
            </button>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium uppercase tracking-wider">AI PRICE CORRELATION INSIGHT</span>
              <span className="text-gray-600">•</span>
              <Tag color={selectedNews.sentiment === "positive" ? "green" : selectedNews.sentiment === "negative" ? "red" : "blue"}>
                {selectedNews.sentiment === "positive" ? "Tích cực" : selectedNews.sentiment === "negative" ? "Tiêu cực" : "Trung lập"}
              </Tag>
              <Tag color="purple">Độ liên quan: {((selectedNews.relevanceScore || 0.5) * 100).toFixed(0)}%</Tag>
              <span className="text-gray-500">{new Date(selectedNews.publishedAt).toLocaleDateString("vi-VN")}</span>
            </div>

            <Title level={5} className="!text-white !m-0">
              <a href={selectedNews.url} target="_blank" rel="noreferrer" className="hover:underline text-blue-400">
                {selectedNews.title}
              </a>
            </Title>

            <p className="text-gray-300 text-sm m-0">{selectedNews.sapo}</p>

            {selectedNews.strategicImplication && (
              <div className="p-3 bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Tác động chiến lược (AI):</div>
                <div className="text-gray-300 text-sm">{selectedNews.strategicImplication}</div>
              </div>
            )}

            <div className="flex flex-wrap gap-1 items-center mt-2">
              <span className="text-xs text-gray-500 mr-2">Nhãn vĩ mô / chính sách:</span>
              {(selectedNews.macroTags || []).map((t) => (
                <Tag key={t} color="cyan" className="m-0">
                  {t}
                </Tag>
              ))}
              {(selectedNews.policyTags || []).map((t) => (
                <Tag key={t} color="volcano" className="m-0">
                  {t}
                </Tag>
              ))}
              {(!selectedNews.macroTags?.length && !selectedNews.policyTags?.length) && (
                <span className="text-xs text-gray-600 italic">Không có nhãn</span>
              )}
            </div>
          </div>
        )}
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
