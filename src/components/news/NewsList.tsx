import React from 'react';
import { Empty, Spin, Button } from 'antd';
import { NewsArticle } from '@/types/news';
import { NewsCard } from './NewsCard';

interface NewsListProps {
  articles: NewsArticle[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const NewsList: React.FC<NewsListProps> = ({ 
  articles, 
  loading, 
  onLoadMore, 
  hasMore 
}) => {
  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" tip="Đang tải tin tức..." />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <Empty 
        description="Không tìm thấy tin tức nào" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="py-12"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map(article => (
        <NewsCard key={article._id} article={article} />
      ))}
      
      {hasMore && (
        <div className="flex justify-center mt-4 pb-8">
          <Button 
            onClick={onLoadMore} 
            loading={loading}
            className="bg-[#333] border-[#444] text-gray-300 hover:text-white"
          >
            Tải thêm tin tức
          </Button>
        </div>
      )}
    </div>
  );
};
