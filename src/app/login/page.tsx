"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card, App, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { ApiError } from "@/services/api-client";

const { Title, Text } = Typography;

interface LoginError {
  type: "warning" | "error";
  message: string;
  description?: string;
}

function getLoginError(err: unknown): LoginError {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return {
        type: "error",
        message: "Sai email hoặc mật khẩu",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập.",
      };
    }
    if (err.status === 403) {
      return {
        type: "warning",
        message: "Tài khoản bị vô hiệu hóa",
        description: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      };
    }
    if (err.status === 400) {
      return {
        type: "error",
        message: "Thông tin không hợp lệ",
        description: err.message,
      };
    }
    if (err.status >= 500) {
      return {
        type: "error",
        message: "Lỗi hệ thống",
        description: "Máy chủ gặp sự cố, vui lòng thử lại sau.",
      };
    }
    return {
      type: "error",
      message: "Đăng nhập thất bại",
      description: err.message,
    };
  }
  return {
    type: "error",
    message: "Không thể kết nối đến máy chủ",
    description: "Vui lòng kiểm tra kết nối mạng và thử lại.",
  };
}

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await login(values);
      message.success("Đăng nhập thành công!");
      router.push("/");
    } catch (err) {
      setError(getLoginError(err));
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

        {error && (
          <Alert
            type={error.type}
            message={error.message}
            description={error.description}
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

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
