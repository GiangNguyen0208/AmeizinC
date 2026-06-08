"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography, List, Card, Tag, Select, Input } from "antd";
import { fetchNews } from "@/services/news";
import { LoadingState } from "@/components/ui";

const { Title, Text } = Typography;
const { Search } = Input;

export default function NewsFeedPage() {
  const [params, setParams] = useState({ page: 1, limit: 10, sort: 'latest' as const });
  const { data, isLoading } = useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
  });

  return (
    <div className="space-y-6">
      <Title level={2} style={{ color: "#fff" }}>AI News Feed</Title>
      
      <div className="flex gap-4">
        <Search placeholder="Search news..." onSearch={(q) => setParams(p => ({...p, q}))} style={{ width: 300 }} />
        <Select defaultValue="latest" onChange={(sort) => setParams(p => ({...p, sort}))}>
          <Select.Option value="latest">Latest</Select.Option>
          <Select.Option value="relevance">Relevance</Select.Option>
          <Select.Option value="sentiment">Sentiment</Select.Option>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={data?.data || []}
          renderItem={(article) => (
            <Card className="mb-4">
              <List.Item.Meta
                title={<a href={article.url} target="_blank" rel="noreferrer">{article.title}</a>}
                description={
                  <div className="flex gap-2">
                    <Tag>{article.source}</Tag>
                    <Tag color={article.sentiment === 'positive' ? 'green' : article.sentiment === 'negative' ? 'red' : 'blue'}>
                      {article.sentiment}
                    </Tag>
                    <Text type="secondary">{new Date(article.publishedAt).toLocaleDateString()}</Text>
                  </div>
                }
              />
              <p>{article.sapo}</p>
            </Card>
          )}
        />
      )}
    </div>
  );
}
