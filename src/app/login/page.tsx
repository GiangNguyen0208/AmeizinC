"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card, App } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { ApiError } from "@/services/api-client";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values);
      message.success("Đăng nhập thành công!");
      router.push("/");
    } catch (err) {
      message.error(
        err instanceof ApiError ? err.message : "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
        <Title level={3} className="text-center mb-6!">
          Đăng nhập
        </Title>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item className="mb-0!">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Text className="block text-center text-gray-400 mt-4">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            Đăng ký
          </Link>
        </Text>
      </Card>
    </div>
  );
}
