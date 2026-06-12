"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Row, Col, Tag, Select, Table, Tooltip, Progress, Badge } from "antd";
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

  if (isLoading) return <LoadingState />;

  const statsList = data || [];

  // Table Columns
  const columns = [
    {
      title: "Nguồn Báo",
      dataIndex: "source",
      key: "source",
      render: (text: string) => <strong className="text-white">{text}</strong>,
    },
    {
      title: "Tổng số bài",
      dataIndex: "totalArticles",
      key: "totalArticles",
      sorter: (a: PublisherData, b: PublisherData) => a.totalArticles - b.totalArticles,
    },
    {
      title: "Độ dài tiêu đề (Ký tự)",
      dataIndex: "avgTitleLength",
      key: "avgTitleLength",
      sorter: (a: PublisherData, b: PublisherData) => a.avgTitleLength - b.avgTitleLength,
      render: (val: number) => <Text style={{ color: "#d9d9d9" }}>{val} ký tự</Text>,
    },
    {
      title: "Độ dài bài viết (Số từ)",
      dataIndex: "avgWordCount",
      key: "avgWordCount",
      sorter: (a: PublisherData, b: PublisherData) => a.avgWordCount - b.avgWordCount,
      render: (val: number) => <Text style={{ color: "#d9d9d9" }}>{val} từ</Text>,
    },
    {
      title: "Tỷ lệ Giật tít (Clickbait)",
      dataIndex: "clickbaitRatio",
      key: "clickbaitRatio",
      sorter: (a: PublisherData, b: PublisherData) => a.clickbaitRatio - b.clickbaitRatio,
      render: (val: number) => {
        let color = "green";
        if (val > 30) color = "red";
        else if (val > 15) color = "orange";
        return (
          <div className="flex items-center gap-2">
            <Progress percent={val} size="small" status={val > 30 ? "exception" : "normal"} showInfo={false} style={{ width: 60 }} />
            <Tag color={color}>{val}%</Tag>
          </div>
        );
      },
    },
    {
      title: "Xu hướng Cảm xúc",
      dataIndex: "avgSentimentScore",
      key: "avgSentimentScore",
      sorter: (a: PublisherData, b: PublisherData) => a.avgSentimentScore - b.avgSentimentScore,
      render: (val: number) => {
        let label = "Trung lập";
        if (val > 0.1) {
          label = `Tích cực (+${val})`;
        } else if (val < -0.1) {
          label = `Tiêu cực (${val})`;
        }
        return <Badge status={val > 0.1 ? "success" : val < -0.1 ? "error" : "warning"} text={<span style={{ color: "#d9d9d9" }}>{label}</span>} />;
      },
    },
    {
      title: "Chủ đề viết nhiều",
      dataIndex: "topTopics",
      key: "topTopics",
      render: (topics: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(topics || []).map((t) => (
            <Tag key={t} color="blue" bordered={false}>
              {t}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
        <div>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            📊 Phân Tích Thiên Kiến & Đặc Tính Báo Chí
          </Title>
          <Paragraph className="text-gray-400 mt-1 mb-0">
            Khám phá thói quen đưa tin, tỷ lệ clickbait và xu hướng cảm xúc của các tờ báo tài chính lớn tại Việt Nam.
          </Paragraph>
        </div>
        <Select
          defaultValue="30d"
          value={period}
          onChange={(v: "today" | "7d" | "30d") => setPeriod(v)}
          dropdownStyle={{ backgroundColor: "#1f1f1f" }}
          style={{ width: 140 }}
        >
          <Select.Option value="today">Hôm nay</Select.Option>
          <Select.Option value="7d">7 ngày qua</Select.Option>
          <Select.Option value="30d">30 ngày qua</Select.Option>
        </Select>
      </div>

      <Row gutter={[20, 20]}>
        {/* Clickbait Analyzer Quadrant Chart */}
        <Col xs={24} lg={14}>
          <Card
            title={<span className="text-white font-semibold">🎯 Biểu đồ Định vị Đặc Tính Nguồn Tin (Clickbait Map)</span>}
            bordered={false}
            className="bg-gray-950 border border-gray-800 rounded-2xl"
          >
            <div className="relative w-full h-[400px] bg-gray-900/30 rounded-xl border border-gray-800/80 p-4 flex flex-col justify-between">
              {/* Quadrant Titles */}
              <div className="absolute top-2 left-2 text-red-400/60 text-xs font-bold uppercase tracking-wider">
                Giật tít (Clickbait)
              </div>
              <div className="absolute top-2 right-2 text-cyan-400/60 text-xs font-bold uppercase tracking-wider">
                Chuyên sâu (Analytical)
              </div>
              <div className="absolute bottom-2 left-2 text-gray-500/60 text-xs font-bold uppercase tracking-wider">
                Tin nhanh (Flash News)
              </div>
              <div className="absolute bottom-2 right-2 text-amber-400/60 text-xs font-bold uppercase tracking-wider">
                Khô khan (Concise)
              </div>

              {/* Axis Labels */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 font-bold uppercase tracking-wider Origin-left">
                Độ dài Tiêu đề (Ngắn ➔ Dài)
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Độ dài Bài viết (Ít từ ➔ Nhiều từ)
              </div>

              {/* Grid Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-800/60 dashed"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-800/60 dashed"></div>

              {/* Bubbles Mapping */}
              <div className="relative w-full h-full">
                {statsList.map((pub) => {
                  // Normalize Title Length (Y-axis: 30 to 100) -> Percentage (10% to 90%)
                  const titleMin = 30;
                  const titleMax = 100;
                  const titlePerc = Math.max(10, Math.min(90, ((pub.avgTitleLength - titleMin) / (titleMax - titleMin)) * 100));

                  // Normalize Word Count (X-axis: 50 to 400) -> Percentage (10% to 90%)
                  const wordMin = 50;
                  const wordMax = 400;
                  const wordPerc = Math.max(10, Math.min(90, ((pub.avgWordCount - wordMin) / (wordMax - wordMin)) * 100));

                  // Sentiment determines bubble color (green for positive, red for negative, blue for neutral)
                  let bubbleBg = "bg-blue-500/30 border-blue-400 shadow-blue-500/10";
                  if (pub.avgSentimentScore > 0.05) {
                    bubbleBg = "bg-green-500/30 border-green-400 shadow-green-500/10";
                  } else if (pub.avgSentimentScore < -0.05) {
                    bubbleBg = "bg-red-500/30 border-red-400 shadow-red-500/10";
                  }

                  return (
                    <Tooltip
                      key={pub.source}
                      title={
                        <div className="p-2 space-y-1">
                          <strong className="text-base text-white">{pub.source}</strong>
                          <div>Độ dài tiêu đề: {pub.avgTitleLength} ký tự</div>
                          <div>Độ dài bài viết: {pub.avgWordCount} từ</div>
                          <div>Tỷ lệ Clickbait: {pub.clickbaitRatio}%</div>
                          <div>Xu hướng cảm xúc: {pub.avgSentimentScore}</div>
                        </div>
                      }
                    >
                      <div
                        className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full border shadow-lg cursor-pointer transition-all hover:scale-115 hover:z-20 flex items-center gap-2 ${bubbleBg}`}
                        style={{
                          left: `${wordPerc}%`,
                          bottom: `${titlePerc}%`,
                        }}
                      >
                        <span className="text-xs font-bold text-white whitespace-nowrap">{pub.source}</span>
                        <Badge count={`${pub.clickbaitRatio}%`} style={{ backgroundColor: pub.clickbaitRatio > 25 ? "#f5222d" : "#52c41a" }} />
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            <div className="text-[11px] text-gray-500 mt-3 flex justify-between">
              <span>*Hover vào bong bóng để xem phân tích chi tiết.</span>
              <span>*Dữ liệu được làm giàu tự động bằng Gemini AI.</span>
            </div>
          </Card>
        </Col>

        {/* Media Bias Slider / Sentiment Indicator */}
        <Col xs={24} lg={10}>
          <Card
            title={<span className="text-white font-semibold">⚖️ Cảm Xúc / Thiên Kiến Truyền Thông (Media Bias Index)</span>}
            bordered={false}
            className="bg-gray-950 border border-gray-800 rounded-2xl h-full"
          >
            <div className="space-y-6">
              <Paragraph className="text-gray-400 text-sm">
                Chỉ số này phản ánh xu hướng đưa tin tích cực hay tiêu cực của mỗi báo đối với toàn thị trường chứng khoán.
              </Paragraph>

              <div className="space-y-5">
                {statsList.map((pub) => {
                  // Normalize sentiment score (-0.5 to 0.5) to progress percentage (0 to 100)
                  const score = pub.avgSentimentScore;
                  const percent = Math.max(0, Math.min(100, ((score + 0.5) / 1) * 100));

                  let biasClass = "text-yellow-400";
                  let biasLabel = "Trung lập";
                  if (score > 0.08) {
                    biasClass = "text-green-400";
                    biasLabel = "Tích cực";
                  } else if (score < -0.08) {
                    biasClass = "text-red-400";
                    biasLabel = "Tiêu cực";
                  }

                  return (
                    <div key={pub.source} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text className="text-white font-bold">{pub.source}</Text>
                        <Text className={`text-xs ${biasClass}`}>{biasLabel} ({score > 0 ? `+${score}` : score})</Text>
                      </div>
                      <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        {/* Middle anchor */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-600/50 z-10"></div>
                        <div
                          className={`absolute top-0 bottom-0 rounded-full transition-all duration-500 ${
                            score > 0.08
                              ? "bg-gradient-to-r from-green-500 to-emerald-400"
                              : score < -0.08
                              ? "bg-gradient-to-r from-red-600 to-red-400"
                              : "bg-gradient-to-r from-yellow-500 to-amber-400"
                          }`}
                          style={{
                            left: score >= 0 ? "50%" : `${percent}%`,
                            width: `${Math.abs(percent - 50)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Analytics */}
      <Card
        title={<span className="text-white font-semibold">📋 Bảng Tổng Hợp Thống Kê Chi Tiết Tờ Báo</span>}
        bordered={false}
        className="bg-gray-950 border border-gray-800 rounded-2xl"
      >
        <Table
          dataSource={statsList}
          columns={columns}
          rowKey="source"
          pagination={false}
          scroll={{ x: true }}
          className="custom-antd-table"
        />
      </Card>
    </div>
  );
}
