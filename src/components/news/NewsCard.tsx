import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  LineOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { NewsArticle, Sentiment } from '@/types/news';
import { formatRelativeTime } from '@/utils';

const { Text, Title, Paragraph } = Typography;

interface NewsCardProps {
  article: NewsArticle;
}

const sentimentConfig: Record<Sentiment, { color: string; icon: React.ReactNode; label: string }> = {
  positive: { 
    color: '#10B981', 
    icon: <ArrowUpOutlined />, 
    label: 'Tích cực' 
  },
  negative: { 
    color: '#EF4444', 
    icon: <ArrowDownOutlined />, 
    label: 'Tiêu cực' 
  },
  neutral: { 
    color: '#9CA3AF', 
    icon: <LineOutlined />, 
    label: 'Trung lập' 
  },
};

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const sentiment = sentimentConfig[article.sentiment];

  return (
    <Card 
      hoverable 
      className="mb-4 bg-[#1a1a1a] border-[#333] hover:border-[#444]"
      styles={{ body: { padding: '16px' } }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <Space wrap size={[4, 8]}>
            {article.tickers.map(ticker => (
              <Tag 
                key={ticker} 
                color="blue" 
                className="font-bold cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/stock/${ticker}`;
                }}
              >
                {ticker}
              </Tag>
            ))}
            <Tag color={sentiment.color} icon={sentiment.icon}>
              {sentiment.label} ({article.sentimentScore.toFixed(2)})
            </Tag>
            {article.topic.map(t => (
              <Tag key={t} className="bg-[#333] border-none text-gray-400 capitalize">
                {t}
              </Tag>
            ))}
          </Space>
          <Text className="text-gray-500 text-xs">
            <ClockCircleOutlined className="mr-1" />
            {formatRelativeTime(article.publishedAt)}
          </Text>
        </div>

        <Title level={4} className="!text-gray-100 !m-0 leading-snug">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            {article.title}
          </a>
        </Title>

        <Paragraph className="text-gray-400 m-0 line-clamp-2 text-sm">
          {article.sapo}
        </Paragraph>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#333]">
          <Space className="text-gray-500 text-xs">
            <GlobalOutlined />
            <Text className="text-gray-500">{article.source}</Text>
          </Space>
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 text-xs flex items-center"
          >
            Xem chi tiết <LinkOutlined className="ml-1" />
          </a>
        </div>
      </div>
    </Card>
  );
};
