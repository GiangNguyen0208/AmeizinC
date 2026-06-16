"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography, Select, Input, Empty } from "antd";
import { SearchOutlined, SlidersOutlined } from "@ant-design/icons";
import { fetchNews } from "@/services/news";
import { LoadingState } from "@/components/ui";
import { NewsFilterParams } from "@/types/news";

const { Title, Text, Paragraph } = Typography;

export default function NewsFeedPage() {
  const [params, setParams] = useState<NewsFilterParams>({ page: 1, limit: 20, sort: 'latest' });
  const { data, isLoading } = useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]';
      case 'negative': return 'text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-[0_0_10px_rgba(251,113,133,0.1)]';
      default: return 'text-sky-400 bg-sky-400/10 border-sky-400/20 shadow-[0_0_10px_rgba(56,189,248,0.1)]';
    }
  };

  const getRelevanceGlow = (score: number) => {
    if (score > 0.8) return 'hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] border-sky-500/30';
    if (score > 0.6) return 'hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] border-gray-700/50';
    return 'border-gray-800/50 hover:border-gray-700';
  };

  return (
    <div className="space-y-8 min-h-screen pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 border border-gray-800/60 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Real-time AI Processing
            </div>
            <Title level={1} className="!text-white !m-0 !text-4xl md:!text-5xl font-bold tracking-tight">
              The Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">News Terminal</span>
            </Title>
            <Paragraph className="text-gray-400 text-base md:text-lg m-0">
              Luồng tin tức thị trường được làm giàu bởi AI. Phân tích cảm xúc, tác động vĩ mô và tín hiệu đầu tư tức thời.
            </Paragraph>
          </div>

          {/* Sticky-like Toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-gray-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-gray-800">
            <Input 
              prefix={<SearchOutlined className="text-gray-500" />}
              placeholder="Search intelligence..." 
              onChange={(e) => {
                const q = e.target.value;
                // Debounce search in a real app, here we just set it directly on enter or blur for simplicity
                if(e.type === 'blur' || (e as any).key === 'Enter') setParams(p => ({...p, q}));
              }}
              onPressEnter={(e) => setParams(p => ({...p, q: e.currentTarget.value}))}
              className="bg-transparent border-none text-white w-full md:w-48 shadow-none focus:ring-0 placeholder:text-gray-600" 
              allowClear 
            />
            <div className="w-[1px] h-6 bg-gray-800 hidden md:block"></div>
            <Select 
              value={params.sort} 
              onChange={(sort: NewsFilterParams['sort']) => setParams(p => ({...p, sort}))}
              variant="borderless"
              className="min-w-[130px] custom-dark-select"
              popupClassName="dark-dropdown"
              suffixIcon={<SlidersOutlined className="text-gray-500" />}
            >
              <Select.Option value="latest">⚡ Mới nhất</Select.Option>
              <Select.Option value="relevance">🎯 Độ liên quan</Select.Option>
              <Select.Option value="sentiment">🎭 Cảm xúc</Select.Option>
            </Select>
            <Select 
              placeholder="Vĩ mô" 
              allowClear
              variant="borderless"
              onChange={(macroTag: string) => setParams(p => ({...p, macroTag}))}
              className="min-w-[120px] custom-dark-select"
              popupClassName="dark-dropdown"
              options={[
                { value: 'interest-rate', label: 'Lãi suất' },
                { value: 'gdp', label: 'GDP' },
                { value: 'inflation', label: 'Lạm phát' },
                { value: 'forex', label: 'Tỷ giá' },
              ]}
            />
            <Select 
              placeholder="Chính sách" 
              allowClear
              variant="borderless"
              onChange={(policyTag: string) => setParams(p => ({...p, policyTag}))}
              className="min-w-[130px] custom-dark-select"
              popupClassName="dark-dropdown"
              options={[
                { value: 'regulation', label: 'Quy định' },
                { value: 'tax', label: 'Thuế' },
                { value: 'stimulus', label: 'Kích thích' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-20"><LoadingState /></div>
      ) : !data?.data?.length ? (
        <Empty 
          description={<span className="text-gray-500">Không tìm thấy bản tin nào phù hợp</span>}
          className="py-20"
        />
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {data.data.map((article: any) => {
            // Determine if card should be "featured" (larger)
            const isFeatured = article.relevanceScore > 0.8 || Math.abs(article.sentimentScore) > 0.5;
            
            return (
              <a 
                key={article._id}
                href={article.url} 
                target="_blank" 
                rel="noreferrer"
                className={`group block break-inside-avoid bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 ${getRelevanceGlow(article.relevanceScore)} ${isFeatured ? 'col-span-1 md:col-span-2 lg:col-span-2' : ''}`}
              >
                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{article.source}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSentimentColor(article.sentiment)}`}>
                    {article.sentiment === 'positive' ? 'Bullish' : article.sentiment === 'negative' ? 'Bearish' : 'Neutral'}
                  </div>
                </div>

                {/* Title */}
                <h3 className={`font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-3 leading-snug ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
                  {article.title}
                </h3>

                {/* AI Summary (Sapo) */}
                <div className="relative mb-5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full"></div>
                  <p className="text-gray-400 text-sm leading-relaxed pl-4 line-clamp-4">
                    {article.sapo}
                  </p>
                </div>

                {/* Tags & Entities */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-800/50">
                  {/* Tickers */}
                  {article.tickers?.slice(0, 3).map((ticker: string) => (
                    <span key={ticker} className="px-2 py-1 rounded bg-gray-800/80 text-gray-300 text-xs font-medium border border-gray-700/50 hover:bg-gray-700 transition-colors">
                      ${ticker}
                    </span>
                  ))}
                  
                  {/* Topics/Tags */}
                  {[...(article.topic || []), ...(article.macroTags || []), ...(article.policyTags || [])]
                    .slice(0, 3 - (article.tickers?.length || 0)) // Limit total tags
                    .map((tag: string) => (
                      <span key={tag} className="px-2 py-1 rounded bg-blue-900/10 text-blue-300/80 text-[10px] uppercase font-bold tracking-wider border border-blue-800/30">
                        {tag}
                      </span>
                  ))}
                  
                  {/* Relevance Score indicator */}
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Rel</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div 
                          key={i} 
                          className={`w-1 h-2 rounded-sm ${i <= Math.ceil(article.relevanceScore * 5) ? 'bg-sky-400' : 'bg-gray-800'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
      
      {/* Global styles for overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-dark-select .ant-select-selector {
          background-color: transparent !important;
          color: white !important;
        }
        .custom-dark-select .ant-select-selection-item {
          color: white !important;
        }
        .custom-dark-select .ant-select-selection-placeholder {
          color: #6b7280 !important;
        }
        .dark-dropdown {
          background-color: #030712 !important;
          border: 1px solid #1f2937 !important;
          padding: 4px !important;
        }
        .dark-dropdown .ant-select-item {
          color: #9ca3af !important;
          border-radius: 6px !important;
        }
        .dark-dropdown .ant-select-item-option-active, 
        .dark-dropdown .ant-select-item-option-selected {
          background-color: #111827 !important;
          color: white !important;
        }
      `}} />
    </div>
  );
}
