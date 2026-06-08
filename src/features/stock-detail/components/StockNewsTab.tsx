"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, Empty, Spin, Space, Tag } from 'antd';
import { NewsList } from '@/components/news/NewsList';
import { fetchNewsByTicker, fetchSentimentTimeline } from '@/services/news';
import { NewsArticle, SentimentTimelineResponse } from '@/types/news';
import { 
  ThunderboltOutlined, 
  RiseOutlined, 
  FallOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface StockNewsTabProps {
  symbol: string;
}

export const StockNewsTab: React.FC<StockNewsTabProps> = ({ symbol }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [timeline, setTimeline] = useState<SentimentTimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [newsRes, timelineRes] = await Promise.all([
          fetchNewsByTicker(symbol),
          fetchSentimentTimeline(symbol, 30)
        ]);
        setNews(newsRes.data);
        setHasMore(newsRes.hasMore);
        setTimeline(timelineRes);
      } catch (error) {
        console.error('Failed to load stock news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      const res = await fetchNewsByTicker(symbol, nextPage);
      setNews(prev => [...prev, ...res.data]);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more news:', error);
    }
  };

  const avgSentiment = timeline ? 
    timeline.sentiments.reduce((a, b) => a + b, 0) / (timeline.sentiments.length || 1) : 0;

  return (
    <div className="space-y-6 mt-4">
      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="bg-[#1a1a1a] border-[#333]">
            <Statistic
              title={<span className="text-gray-400">Tâm lý Trung bình (30 ngày)</span>}
              value={avgSentiment.toFixed(2)}
              precision={2}
              valueStyle={{ color: avgSentiment > 0 ? '#10B981' : avgSentiment < 0 ? '#EF4444' : '#9CA3AF' }}
              prefix={avgSentiment > 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="/ 1.0"
            />
            <Text className="text-gray-500 text-xs mt-2 block">
              Dựa trên {news.length} bài phân tích AI
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card className="bg-[#1a1a1a] border-[#333]" title={<span className="text-gray-300 text-sm">Diễn biến Tâm lý</span>}>
            <div className="h-[120px] w-full flex justify-center items-center">
              <Text className="text-gray-500">Biểu đồ tạm thời bị tắt để kiểm tra lỗi hệ thống</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!text-white !m-0">
              <ThunderboltOutlined className="text-yellow-500 mr-2" />
              Tin tức & Phân tích AI
            </Title>
          </div>
          <NewsList 
            articles={news} 
            loading={loading} 
            hasMore={hasMore} 
            onLoadMore={handleLoadMore} 
          />
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            className="bg-[#1a1a1a] border-[#333]" 
            title={<span className="text-gray-200"><InfoCircleOutlined className="mr-2" />Thông tin liên quan</span>}
          >
            <div className="space-y-4">
              <div>
                <Text className="text-gray-400 text-xs block mb-2 uppercase tracking-wider">Công ty nhắc tới</Text>
                <div className="flex flex-wrap gap-2">
                  {timeline?.relatedCompanies.map(c => (
                    <Tag key={c} className="bg-[#262626] border-[#333] text-gray-300 m-0">{c}</Tag>
                  )) || <Text className="text-gray-500 italic text-sm">Chưa có dữ liệu</Text>}
                </div>
              </div>

              <div className="pt-4 border-t border-[#333]">
                <Paragraph className="text-gray-400 text-xs italic m-0">
                  Lưu ý: Các phân tích tâm lý và thẻ tag được thực hiện tự động bởi AI (Gemini 1.5 Flash). Thông tin mang tính tham khảo, không phải lời khuyên đầu tư.
                </Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
