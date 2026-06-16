"use client";

import { Card, Typography, Form, Input, Switch, Button, message, Divider } from "antd";
import { useState } from "react";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { apiRequest } from "@/services/api-client";

const { Title, Text, Paragraph } = Typography;

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      // TODO: Connect to backend API to save these settings
      console.log("Settings to save:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      message.success("Lưu cấu hình thông báo thành công!");
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi lưu cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const handleTestDiscord = async () => {
    const webhookUrl = form.getFieldValue("discordWebhook");
    if (!webhookUrl) {
      message.warning("Vui lòng nhập Webhook URL trước khi thử nghiệm");
      return;
    }
    
    try {
      message.loading({ content: "Đang gửi tin nhắn thử nghiệm tới Discord...", key: "test_discord" });
      await apiRequest("/auth/test-notification", {
        method: "POST",
        body: JSON.stringify({ channel: "discord", destination: webhookUrl }),
      });
      message.success({ content: "Gửi tin nhắn thử nghiệm thành công! Vui lòng kiểm tra Discord của bạn.", key: "test_discord" });
    } catch (error: any) {
      message.error({ content: error.message || "Không thể gửi tin nhắn thử nghiệm tới Discord", key: "test_discord" });
    }
  };

  const handleTestTelegram = async () => {
    const chatId = form.getFieldValue("telegramChatId");
    if (!chatId) {
      message.warning("Vui lòng nhập Chat ID trước khi thử nghiệm");
      return;
    }
    
    try {
      message.loading({ content: "Đang gửi tin nhắn thử nghiệm tới Telegram...", key: "test_telegram" });
      await apiRequest("/auth/test-notification", {
        method: "POST",
        body: JSON.stringify({ channel: "telegram", destination: chatId }),
      });
      message.success({ content: "Gửi tin nhắn thử nghiệm thành công! Vui lòng kiểm tra Telegram của bạn.", key: "test_telegram" });
    } catch (error: any) {
      message.error({ content: error.message || "Không thể gửi tin nhắn thử nghiệm tới Telegram", key: "test_telegram" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          🔔 Cài đặt Thông báo & Bản tin
        </Title>
        <Paragraph className="text-gray-400 mt-1">
          Cấu hình kênh nhận bản tin AI Daily Brief và các cảnh báo tin tức thị trường quan trọng.
        </Paragraph>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          enableDiscord: false,
          enableTelegram: false,
          alertDailyBrief: true,
          alertSentiment: true,
          alertPolicy: true,
        }}
      >
        <Card className="bg-gray-900/40 border border-gray-800 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                <i className="text-[#5865F2] text-xl">🎮</i>
              </div>
              <div>
                <Title level={5} className="!text-white !m-0">Discord Webhook</Title>
                <Text className="text-gray-400 text-xs">Nhận bản tin đẹp mắt trực tiếp vào Server Discord của bạn</Text>
              </div>
            </div>
            <Form.Item name="enableDiscord" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>

          <Form.Item 
            name="discordWebhook" 
            label={<span className="text-gray-300">Webhook URL</span>}
            tooltip="Lấy từ Server Settings > Integrations > Webhooks trên Discord"
          >
            <Input 
              placeholder="https://discord.com/api/webhooks/..." 
              className="bg-gray-800 border-gray-700 text-white" 
            />
          </Form.Item>
          
          <Button 
            type="dashed" 
            icon={<SendOutlined />} 
            onClick={handleTestDiscord}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            Gửi thử nghiệm
          </Button>
        </Card>

        <Card className="bg-gray-900/40 border border-gray-800 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center">
                <i className="text-[#0088cc] text-xl">✈️</i>
              </div>
              <div>
                <Title level={5} className="!text-white !m-0">Telegram Bot</Title>
                <Text className="text-gray-400 text-xs">Nhận thông báo cực nhanh qua ứng dụng Telegram</Text>
              </div>
            </div>
            <Form.Item name="enableTelegram" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>

          <Form.Item 
            name="telegramChatId" 
            label={<span className="text-gray-300">Chat ID</span>}
            tooltip="Chat ID của cá nhân hoặc Channel/Group"
          >
            <Input 
              placeholder="-100123456789 hoặc 123456789" 
              className="bg-gray-800 border-gray-700 text-white" 
            />
          </Form.Item>

          <Button 
            type="dashed" 
            icon={<SendOutlined />} 
            onClick={handleTestTelegram}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            Gửi thử nghiệm
          </Button>
        </Card>

        <Card className="bg-gray-900/40 border border-gray-800 rounded-2xl mb-6">
          <Title level={5} className="!text-white mb-4">Loại thông báo đăng ký</Title>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Text className="text-gray-200 block">AI Daily Brief</Text>
                <Text className="text-gray-500 text-xs">Bản tin tổng hợp toàn cảnh thị trường mỗi ngày</Text>
              </div>
              <Form.Item name="alertDailyBrief" valuePropName="checked" noStyle>
                <Switch size="small" />
              </Form.Item>
            </div>
            <Divider className="my-1 border-gray-800" />

            <div className="flex justify-between items-center">
              <div>
                <Text className="text-gray-200 block">Biến động Cảm xúc Thị trường</Text>
                <Text className="text-gray-500 text-xs">Nhận thông báo khi có lượng lớn tin tức tiêu cực/tích cực bất thường</Text>
              </div>
              <Form.Item name="alertSentiment" valuePropName="checked" noStyle>
                <Switch size="small" />
              </Form.Item>
            </div>
            <Divider className="my-1 border-gray-800" />

            <div className="flex justify-between items-center">
              <div>
                <Text className="text-gray-200 block">Tin tức Chính sách Vĩ mô</Text>
                <Text className="text-gray-500 text-xs">Cập nhật ngay lập tức các quyết định từ NHNN, Dự thảo luật quan trọng</Text>
              </div>
              <Form.Item name="alertPolicy" valuePropName="checked" noStyle>
                <Switch size="small" />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Button 
          type="primary" 
          htmlType="submit" 
          icon={<SaveOutlined />} 
          loading={loading}
          size="large"
          className="w-full bg-blue-600 hover:bg-blue-500"
        >
          Lưu Cài Đặt
        </Button>
      </Form>
    </div>
  );
}
