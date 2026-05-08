"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card, App, Result } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth";
import { ApiError } from "@/services/api-client";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const onFinish = async (values: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    setLoading(true);
    try {
      await register(values);
      setRegisteredEmail(values.email);
      setRegistered(true);
    } catch (err) {
      message.error(
        err instanceof ApiError ? err.message : "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
          <Result
            status="success"
            title="Đăng ký thành công!"
            subTitle={`Chúng tôi đã gửi email xác nhận đến ${registeredEmail}. Vui lòng kiểm tra hộp thư và click link xác nhận để kích hoạt tài khoản.`}
            extra={
              <Button type="primary" onClick={() => router.push("/")}>
                Về trang chủ
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
        <Title level={3} className="text-center mb-6!">
          Đăng ký tài khoản
        </Title>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              size="large"
            />
          </Form.Item>
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
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
            ]}
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Text className="block text-center text-gray-400 mt-4">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Đăng nhập
          </Link>
        </Text>
      </Card>
    </div>
  );
}
