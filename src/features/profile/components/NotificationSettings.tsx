"use client";

import { Card, Typography, Form, Input, Switch, Button, message, Divider } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { testNotification } from "@/services/profile";

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

  const testMutation = useMutation({
    mutationFn: ({ channel, destination }: { channel: "discord" | "telegram"; destination: string }) =>
      testNotification(channel, destination),
    onMutate: (variables) => {
      message.loading({ content: `Đang gửi tin nhắn thử nghiệm tới ${variables.channel === "discord" ? "Discord" : "Telegram"}...`, key: "test_notification" });
    },
    onSuccess: (_, variables) => {
      message.success({ content: `Gửi tin nhắn thử nghiệm thành công! Vui lòng kiểm tra ${variables.channel === "discord" ? "Discord" : "Telegram"} của bạn.`, key: "test_notification" });
    },
    onError: (error: any, variables) => {
      message.error({ content: error.message || `Không thể gửi tin nhắn thử nghiệm tới ${variables.channel === "discord" ? "Discord" : "Telegram"}`, key: "test_notification" });
    },
  });

  const handleTestDiscord = () => {
    const webhookUrl = form.getFieldValue("discordWebhook");
    if (!webhookUrl) {
      message.warning("Vui lòng nhập Webhook URL trước khi thử nghiệm");
      return;
    }
    testMutation.mutate({ channel: "discord", destination: webhookUrl });
  };

  const handleTestTelegram = () => {
    const chatId = form.getFieldValue("telegramChatId");
    if (!chatId) {
      message.warning("Vui lòng nhập Chat ID trước khi thử nghiệm");
      return;
    }
    testMutation.mutate({ channel: "telegram", destination: chatId });
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
            label={<span className="text-gray-300 font-semibold">Webhook URL</span>}
            className="mb-2"
          >
            <Input 
              placeholder="https://discord.com/api/webhooks/..." 
              className="bg-gray-800 border-gray-700 text-white py-2" 
            />
          </Form.Item>
          
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700/50">
            <Text className="text-gray-300 text-xs block mb-1 font-semibold">💡 Cách lấy Webhook URL:</Text>
            <Text className="text-gray-400 text-xs block">
              1. Mở Discord, vào <b>Server Settings</b> của server bạn quản lý.<br/>
              2. Chọn <b>Integrations</b> &gt; <b>Webhooks</b> &gt; <b>New Webhook</b>.<br/>
              3. Chọn kênh muốn nhận tin, bấm <b>Copy Webhook URL</b> và dán vào ô bên trên.
            </Text>
          </div>
          
          <Button 
            type="dashed" 
            icon={<SendOutlined />} 
            onClick={handleTestDiscord}
            loading={testMutation.isPending && testMutation.variables?.channel === "discord"}
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
            label={<span className="text-gray-300 font-semibold">Chat ID của bạn</span>}
            className="mb-2"
          >
            <Input 
              placeholder="Ví dụ: 123456789" 
              className="bg-gray-800 border-gray-700 text-white py-2" 
            />
          </Form.Item>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700/50">
            <Text className="text-gray-300 text-xs block mb-1 font-semibold">💡 Hướng dẫn nhận tin qua Telegram:</Text>
            <Text className="text-gray-400 text-xs block">
              1. Mở Telegram, tìm kiếm bot <b>@userinfobot</b> và bấm Start để lấy chuỗi số <b>Id</b> của bạn (Vd: 123456789). Dán ID đó vào ô trên.<br/>
              2. Tìm kiếm bot của hệ thống: <a href="https://t.me/ameizinC_bot" target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline">@ameizinC_bot</a>.<br/>
              3. Bấm <b>/start</b> với @ameizinC_bot (Bắt buộc để bot có quyền nhắn tin cho bạn).<br/>
              4. Quay lại đây bấm <b>Gửi thử nghiệm</b>.
            </Text>
          </div>

          <Button 
            type="dashed" 
            icon={<SendOutlined />} 
            onClick={handleTestTelegram}
            loading={testMutation.isPending && testMutation.variables?.channel === "telegram"}
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
