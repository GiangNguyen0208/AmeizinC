"use client";

import { Col, Row, Typography, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { MarketIndexCards } from "./components/MarketIndexCards";
import { StockTable } from "./components/StockTable";
import { useTopGainers, useTopLosers, useTopVolume } from "@/hooks";
import { DataUpdateNote, DataFreshness, MarketBreadth, VietnamHolidayNotice } from "@/components/ui";
import { exportToCSV } from "@/utils";
import type { TopStock } from "@/types";

const { Title } = Typography;

function handleExport(gainers?: TopStock[], losers?: TopStock[], topVol?: TopStock[]) {
  const all = [...(gainers || []), ...(losers || []), ...(topVol || [])];
  const unique = [...new Map(all.map((s) => [s.symbol, s])).values()];
  exportToCSV(
    `ameizin-market-${new Date().toISOString().split("T")[0]}.csv`,
    ["Mã CK", "Công ty", "Giá", "Thay đổi", "% Thay đổi", "Khối lượng"],
    unique.map((s) => [s.symbol, s.companyName, s.price, s.change, s.changePercent, s.volume])
  );
}

export function MarketOverview() {
  const { data: gainers, isLoading: loadingGainers } = useTopGainers();
  const { data: losers, isLoading: loadingLosers } = useTopLosers();
  const { data: topVol, isLoading: loadingVol } = useTopVolume();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Tổng quan thị trường
        </Title>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DataFreshness />
          <Button
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => handleExport(gainers, losers, topVol)}
            disabled={!gainers && !losers && !topVol}
            className="w-full sm:w-auto"
          >
            Export CSV
          </Button>
        </div>
      </div>

      <VietnamHolidayNotice />
      <MarketIndexCards />
      <MarketBreadth />
      <DataUpdateNote />

      <Row gutter={[12, 16]}>
        <Col xs={24} md={8}>
          <StockTable data={gainers} loading={loadingGainers} title="Top tăng giá" filterable />
        </Col>
        <Col xs={24} md={8}>
          <StockTable data={losers} loading={loadingLosers} title="Top giảm giá" filterable />
        </Col>
        <Col xs={24} md={8}>
          <StockTable data={topVol} loading={loadingVol} title="Top khối lượng" filterable />
        </Col>
      </Row>
    </div>
  );
}
