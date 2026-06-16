"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Row, Col, Select, Tooltip, Progress } from "antd";
import { fetchPublisherStats } from "@/services/dashboard";
import { LoadingState } from "@/components/ui";

const { Title, Text, Paragraph } = Typography;

interface PublisherData {
  source: string;
  totalArticles: number;
  avgTitleLength: number;
  avgSapoLength: number;
  avgWordCount: number;
  avgSentimentScore: number;
  clickbaitRatio: number;
  topTopics: string[];
  topSectors: string[];
}

export default function PublisherDashboard() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d">("30d");
  const { data, isLoading } = useQuery<PublisherData[]>({
    queryKey: ["publisher-stats", period],
    queryFn: () => fetchPublisherStats(period),
  });

  if (isLoading) return <div className="py-20"><LoadingState /></div>;

  const statsList = data || [];

  return (
    <div className="space-y-8 min-h-screen pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-950 via-[#0f172a] to-gray-950 border border-gray-800/60 p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
            AI Profiling Engine
          </div>
          <Title level={1} className="!text-white !m-0 !text-3xl md:!text-4xl font-bold tracking-tight">
            Publisher <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-300">Bias Radar</span>
          </Title>
          <Paragraph className="text-gray-400 text-base md:text-lg m-0">
            Hồ sơ hóa đặc tính đưa tin, tỷ lệ clickbait và thiên kiến thị trường của các trang báo tài chính Việt Nam.
          </Paragraph>
        </div>
        
        <Select
          value={period}
          onChange={(v: "today" | "7d" | "30d") => setPeriod(v)}
          className="min-w-[150px] relative z-10 custom-dark-select"
          popupClassName="dark-dropdown"
          variant="borderless"
        >
          <Select.Option value="today">⚡ Hôm nay</Select.Option>
          <Select.Option value="7d">📅 7 ngày qua</Select.Option>
          <Select.Option value="30d">🗓️ 30 ngày qua</Select.Option>
        </Select>
      </div>

      <Row gutter={[24, 24]}>
        {/* Clickbait Analyzer Quadrant Chart */}
        <Col xs={24} lg={14}>
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/80 rounded-3xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">🎯</span>
              Clickbait Topology Map
            </h3>
            <p className="text-gray-400 text-sm mb-6">Mô hình phân bố đặc tính viết bài (Tít vs Số từ) để nhận diện báo tin nhanh, giật tít hay chuyên sâu.</p>
            
            <div className="relative w-full h-[450px] bg-gray-950/50 rounded-2xl border border-gray-800/50 flex-grow p-6 overflow-hidden">
              {/* Animated Radar Grid Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Quadrant Titles */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20 backdrop-blur-md">
                Giật tít (Clickbait)
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20 backdrop-blur-md">
                Chuyên sâu (Analytical)
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20 backdrop-blur-md">
                Tin nhanh (Flash News)
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider border border-sky-500/20 backdrop-blur-md">
                Khô khan (Concise)
              </div>

              {/* Axis Labels */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 font-bold uppercase tracking-widest origin-left bg-gray-950/80 px-2 py-1 rounded">
                Độ dài Tiêu đề (Ngắn ➔ Dài)
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-950/80 px-2 py-1 rounded">
                Độ dài Bài viết (Ít từ ➔ Nhiều từ)
              </div>

              {/* Glowing Crosshairs */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-400 rounded-full blur-[4px] -translate-x-1/2 -translate-y-1/2"></div>

              {/* Bubbles Mapping */}
              <div className="relative w-full h-full">
                {statsList.map((pub) => {
                  const titleMin = 30, titleMax = 100;
                  const titlePerc = Math.max(15, Math.min(85, ((pub.avgTitleLength - titleMin) / (titleMax - titleMin)) * 100));

                  const wordMin = 50, wordMax = 400;
                  const wordPerc = Math.max(15, Math.min(85, ((pub.avgWordCount - wordMin) / (wordMax - wordMin)) * 100));

                  let bubbleColor = "sky";
                  if (pub.avgSentimentScore > 0.05) bubbleColor = "emerald";
                  else if (pub.avgSentimentScore < -0.05) bubbleColor = "rose";

                  const bubbleSize = Math.max(40, Math.min(80, 40 + (pub.totalArticles / 100) * 40));

                  return (
                    <Tooltip
                      key={pub.source}
                      color="#0f172a"
                      overlayInnerStyle={{ borderRadius: '12px', border: '1px solid #334155', padding: '12px' }}
                      title={
                        <div className="space-y-2 w-48">
                          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <strong className="text-base text-white">{pub.source}</strong>
                            <span className="text-xs text-gray-400">{pub.totalArticles} bài</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Tiêu đề:</span>
                            <span className="text-gray-200 font-mono">{Math.round(pub.avgTitleLength)} ký tự</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Độ dài:</span>
                            <span className="text-gray-200 font-mono">{Math.round(pub.avgWordCount)} từ</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Clickbait:</span>
                            <span className={`font-mono font-bold ${pub.clickbaitRatio > 25 ? 'text-red-400' : 'text-green-400'}`}>{pub.clickbaitRatio}%</span>
                          </div>
                        </div>
                      }
                    >
                      <div
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-${bubbleColor}-400/50 bg-${bubbleColor}-500/20 shadow-[0_0_15px_rgba(var(--tw-colors-${bubbleColor}-500),0.3)] cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20 flex items-center justify-center backdrop-blur-md ${pub.clickbaitRatio > 30 ? 'animate-pulse' : ''}`}
                        style={{
                          left: `${wordPerc}%`,
                          bottom: `${titlePerc}%`,
                          width: bubbleSize,
                          height: bubbleSize,
                        }}
                      >
                        <span className="text-[10px] font-bold text-white text-center leading-tight drop-shadow-md px-1 truncate w-full">{pub.source}</span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>

        {/* Media Bias Spectrum */}
        <Col xs={24} lg={10}>
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/80 rounded-3xl p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">⚖️</span>
              Market Sentiment Spectrum
            </h3>
            <p className="text-gray-400 text-sm mb-6">Trục thiên kiến đánh giá quan điểm đưa tin của tờ báo đối với toàn thị trường.</p>

            <div className="space-y-6 mt-8 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '420px' }}>
              {statsList.map((pub) => {
                const score = pub.avgSentimentScore;
                const percent = Math.max(0, Math.min(100, ((score + 0.5) / 1) * 100));

                let biasColor = "yellow";
                let biasLabel = "Neutral";
                if (score > 0.08) { biasColor = "emerald"; biasLabel = "Bullish"; }
                else if (score < -0.08) { biasColor = "rose"; biasLabel = "Bearish"; }

                return (
                  <div key={pub.source} className="group relative bg-gray-950/50 p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <Text className="text-white font-bold text-base">{pub.source}</Text>
                      <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-${biasColor}-500/10 text-${biasColor}-400 border border-${biasColor}-500/20`}>
                        {biasLabel} {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
                      </div>
                    </div>
                    
                    {/* The Spectrum Gauge */}
                    <div className="relative w-full h-2 bg-gradient-to-r from-rose-500/30 via-yellow-500/30 to-emerald-500/30 rounded-full">
                      {/* Zero anchor line */}
                      <div className="absolute left-1/2 top-[-4px] bottom-[-4px] w-[1px] bg-gray-500/50 z-0"></div>
                      
                      {/* The Indicator Diamond */}
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-${biasColor}-400 shadow-[0_0_10px_rgba(var(--tw-colors-${biasColor}-500),0.8)] rounded-sm border border-gray-900 z-10 transition-all duration-1000 ease-out`}
                        style={{ left: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* Modern Data Table */}
      <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/80 rounded-3xl overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white m-0">📊 Dữ Liệu Báo Chí Chi Tiết</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950/50 border-b border-gray-800 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nguồn Báo</th>
                <th className="px-6 py-4">Tổng Bài</th>
                <th className="px-6 py-4">Tỷ lệ Clickbait</th>
                <th className="px-6 py-4">Cảm xúc</th>
                <th className="px-6 py-4">Chủ đề viết nhiều</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {statsList.sort((a, b) => b.totalArticles - a.totalArticles).map((pub) => (
                <tr key={pub.source} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-white text-base">{pub.source}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-gray-300 bg-gray-800/50 px-2 py-1 rounded">{pub.totalArticles}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${pub.clickbaitRatio > 25 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, pub.clickbaitRatio)}%` }}
                        ></div>
                      </div>
                      <span className={`font-mono text-xs font-bold ${pub.clickbaitRatio > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>{pub.clickbaitRatio.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${pub.avgSentimentScore > 0.05 ? 'text-emerald-400 bg-emerald-500/10' : pub.avgSentimentScore < -0.05 ? 'text-rose-400 bg-rose-500/10' : 'text-sky-400 bg-sky-500/10'}`}>
                        {pub.avgSentimentScore > 0 ? '+' : ''}{pub.avgSentimentScore.toFixed(2)}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(pub.topTopics || []).slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-gray-800 text-gray-300 border border-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-dark-select .ant-select-selector {
          background-color: rgba(17, 24, 39, 0.7) !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(55, 65, 81, 0.5) !important;
          color: white !important;
          height: 40px !important;
          display: flex;
          align-items: center;
          border-radius: 12px !important;
        }
        .custom-dark-select .ant-select-selection-item {
          color: white !important;
          font-weight: 600;
        }
        .custom-dark-select .ant-select-arrow {
          color: #9ca3af !important;
        }
        .dark-dropdown {
          background-color: #030712 !important;
          border: 1px solid #1f2937 !important;
          padding: 6px !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3) !important;
        }
        .dark-dropdown .ant-select-item {
          color: #9ca3af !important;
          border-radius: 8px !important;
          margin-bottom: 2px;
          padding: 8px 12px;
        }
        .dark-dropdown .ant-select-item-option-active, 
        .dark-dropdown .ant-select-item-option-selected {
          background-color: rgba(59, 130, 246, 0.15) !important;
          color: #60a5fa !important;
          font-weight: bold;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
