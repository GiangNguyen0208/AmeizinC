"use client";

import { Col, Row, Typography } from "antd";
import { MarketIndexCards } from "./components/MarketIndexCards";
import { StockTable } from "./components/StockTable";
import { useTopGainers, useTopLosers, useTopVolume } from "@/hooks";
import { DataUpdateNote, DataFreshness, MarketBreadth } from "@/components/ui";

const { Title } = Typography;

export function MarketOverview() {
  const { data: gainers, isLoading: loadingGainers } = useTopGainers();
  const { data: losers, isLoading: loadingLosers } = useTopLosers();
  const { data: topVol, isLoading: loadingVol } = useTopVolume();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Tổng quan thị trường
        </Title>
        <DataFreshness />
      </div>

      <MarketIndexCards />
      <MarketBreadth />
      <DataUpdateNote />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <StockTable data={gainers} loading={loadingGainers} title="Top tăng giá" />
        </Col>
        <Col xs={24} lg={8}>
          <StockTable data={losers} loading={loadingLosers} title="Top giảm giá" />
        </Col>
        <Col xs={24} lg={8}>
          <StockTable data={topVol} loading={loadingVol} title="Top khối lượng" />
        </Col>
      </Row>
    </div>
  );
}
