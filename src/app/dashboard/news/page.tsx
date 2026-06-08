"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Row, Col } from "antd";
import { Pie } from "@ant-design/plots";
import { fetchDashboardStats } from "@/services/dashboard";
import { LoadingState } from "@/components/ui";

const { Title } = Typography;

export default function SentimentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchDashboardStats('7d'),
  });

  if (isLoading) return <LoadingState />;

  const sentimentData = data?.sentimentDistribution.map((item: { _id: string, count: number }) => ({
    type: item._id,
    value: item.count,
  })) || [];

  return (
    <div className="space-y-6">
      <Title level={2} style={{ color: "#fff" }}>News Sentiment Dashboard</Title>
      
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Sentiment Distribution">
            <Pie
              data={sentimentData}
              angleField="value"
              colorField="type"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
