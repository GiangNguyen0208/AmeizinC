"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography, List, Card, Tag, Select, Input } from "antd";
import { fetchNews } from "@/services/news";
import { LoadingState } from "@/components/ui";
import { NewsFilterParams } from "@/types/news";

const { Title, Text } = Typography;
const { Search } = Input;

export default function NewsFeedPage() {
  const [params, setParams] = useState<NewsFilterParams>({ page: 1, limit: 10, sort: 'latest' });
  const { data, isLoading } = useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
  });

  return (
    <div className="space-y-6">
      <Title level={2} style={{ color: "#fff" }}>AI News Feed</Title>
      
      <div className="flex flex-wrap gap-4">
        <Search placeholder="Tìm kiếm tin tức..." onSearch={(q) => setParams(p => ({...p, q}))} style={{ width: 300 }} allowClear />
        <Select 
          defaultValue="latest" 
          onChange={(sort: NewsFilterParams['sort']) => setParams(p => ({...p, sort}))}
          style={{ minWidth: 120 }}
        >
          <Select.Option value="latest">Mới nhất</Select.Option>
          <Select.Option value="relevance">Độ liên quan</Select.Option>
          <Select.Option value="sentiment">Cảm xúc</Select.Option>
        </Select>
        <Select 
          placeholder="Lọc theo Vĩ mô" 
          allowClear
          onChange={(macroTag: string) => setParams(p => ({...p, macroTag}))}
          style={{ minWidth: 160 }}
          options={[
            { value: 'Lạm phát', label: 'Lạm phát' },
            { value: 'Tỷ giá', label: 'Tỷ giá' },
            { value: 'Lãi suất', label: 'Lãi suất' },
            { value: 'FDI', label: 'FDI' },
            { value: 'GDP', label: 'GDP' },
            { value: 'Xuất nhập khẩu', label: 'Xuất nhập khẩu' },
          ]}
        />
        <Select 
          placeholder="Lọc theo Chính sách" 
          allowClear
          onChange={(policyTag: string) => setParams(p => ({...p, policyTag}))}
          style={{ minWidth: 160 }}
          options={[
            { value: 'Ngân hàng Nhà nước', label: 'Ngân hàng Nhà nước' },
            { value: 'Bộ Tài chính', label: 'Bộ Tài chính' },
            { value: 'Dự thảo luật', label: 'Dự thảo luật' },
            { value: 'Thông tư', label: 'Thông tư' },
            { value: 'Chính phủ', label: 'Chính phủ' },
          ]}
        />
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
