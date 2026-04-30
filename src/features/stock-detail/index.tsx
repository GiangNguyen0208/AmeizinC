"use client";

import { Card, Typography } from "antd";
import { useState } from "react";
import { PriceHeader, FinancialRatiosCard, FinancialStatements, CompanyProfileCard } from "./components";
import { PeriodFilter, PeriodFilterValue } from "./components/PeriodFilter";
import { PriceChart } from "@/components/charts/PriceChart";
import { FinanceTrendChart } from "@/components/charts/FinanceTrendChart";
import { useStockPrice, useHistoricalPrices, useFinanceData, useCompanyProfile } from "@/hooks";
import { LoadingState, ErrorState } from "@/components/ui";
import { computeFinancialRatios } from "@/utils";

const { Title } = Typography;

const DEFAULT_FILTER: PeriodFilterValue = { mode: "preset", days: 90 };

interface StockDetailProps {
  symbol: string;
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [filter, setFilter] = useState<PeriodFilterValue>(DEFAULT_FILTER);

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