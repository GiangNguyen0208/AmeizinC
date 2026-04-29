"use client";

import { Card, Typography, Segmented } from "antd";
import { useState } from "react";
import { PriceHeader, FinancialRatiosCard, FinancialStatements, CompanyProfileCard } from "./components";
import { PriceChart } from "@/components/charts/PriceChart";
import { FinanceTrendChart } from "@/components/charts/FinanceTrendChart";
import { useStockPrice, useHistoricalPrices, useFinanceData, useCompanyProfile } from "@/hooks";
import { LoadingState, ErrorState } from "@/components/ui";
import { computeFinancialRatios } from "@/utils";

const { Title } = Typography;

const PERIOD_OPTIONS = [
  { label: "1 tháng", value: 30 },
  { label: "3 tháng", value: 90 },
  { label: "6 tháng", value: 180 },
  { label: "1 năm", value: 365 },
];

interface StockDetailProps {
  symbol: string;
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [period, setPeriod] = useState(90);
  const { data: price, isLoading: loadingPrice, error: priceError, refetch } = useStockPrice(symbol);
  const { data: history, isLoading: loadingHistory } = useHistoricalPrices(symbol, period);
  const { data: financeData, isLoading: loadingFinance } = useFinanceData(symbol);
  const { data: companyProfile } = useCompanyProfile(symbol);

  if (loadingPrice) return <LoadingState />;
  if (priceError) return <ErrorState message="Không tìm thấy mã cổ phiếu" onRetry={refetch} />;
  if (!price) return null;

  const ratios = financeData ? computeFinancialRatios(financeData) : [];

  return (
    <div className="space-y-6">
      <PriceHeader data={price} />

      {companyProfile && <CompanyProfileCard profile={companyProfile} />}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={5} style={{ color: "#fff", margin: 0 }}>
            Biểu đồ giá — {symbol}
          </Title>
          <Segmented
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(val) => setPeriod(val as number)}
          />
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
                <FinanceTrendChart ratios={ratios} />
              </Card>
            </>
          )}
          <FinancialStatements data={financeData} />
        </>
      ) : null}
    </div>
  );
}
