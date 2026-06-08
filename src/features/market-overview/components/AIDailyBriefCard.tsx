"use client";

import { Card, Typography, List, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyBrief } from "@/services/brief";
import { LoadingState } from "@/components/ui";

const { Title, Text } = Typography;

export function AIDailyBriefCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-brief'],
    queryFn: fetchDailyBrief,
  });

  if (isLoading) return <LoadingState />;
  if (!data) return null;

  return (
    <Card title={<Title level={5} style={{ margin: 0 }}>Bản tin truyền thông AI - {data.date}</Title>}>
      <div className="mb-4">
        <Text>Sentiment thị trường: </Text>
        <Tag color={data.marketSnapshot.sentiment > 0 ? 'green' : data.marketSnapshot.sentiment < 0 ? 'red' : 'blue'}>
          {data.marketSnapshot.sentiment.toFixed(2)}
        </Tag>
      </div>
      <List
        dataSource={data.keyStories}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
