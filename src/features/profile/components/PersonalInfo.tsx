"use client";

import { Form, Input, DatePicker, Button, Card, Alert, App, Descriptions } from "antd";
import { UserOutlined, PhoneOutlined, CalendarOutlined, LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useAuthStore } from "@/stores/auth-store";
import { updateProfile } from "@/services/profile";
import { ApiError } from "@/services/api-client";
import type { ProfileUpdateRequest } from "@/types";

export function PersonalInfo() {
  const { message } = App.useApp();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const payload: ProfileUpdateRequest = {
        fullName: values.fullName as string,
        phone: values.phone as string,
        avatar: values.avatar as string,
        dateOfBirth: values.dateOfBirth
          ? (values.dateOfBirth as dayjs.Dayjs).toISOString()
          : undefined,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof ProfileUpdateRequest] === undefined) {
          delete payload[key as keyof ProfileUpdateRequest];
        }
      });

      const result = await updateProfile(payload);
      setUser(result.user);
      message.success("Cập nhật thông tin thành công");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card
        title="Thông tin cá nhân"
        className="bg-gray-800/50! border-gray-700!"
      >
        <Descriptions
          column={1}
          className="mb-6"
          labelStyle={{ color: "#9ca3af" }}
          contentStyle={{ color: "#e5e7eb" }}
        >
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {user.role === "super_admin"
              ? "Super Admin"
              : user.role === "admin"
                ? "Admin"
                : "Người dùng"}
          </Descriptions.Item>
        </Descriptions>

        {error && (
          <Alert
            type="error"
            message={error}
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            fullName: user.fullName,
            phone: user.phone || "",
            avatar: user.avatar || "",
            dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
          }}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              { max: 255, message: "Tối đa 255 ký tự" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ max: 20, message: "Tối đa 20 ký tự" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              className="w-full"
              suffixIcon={<CalendarOutlined />}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Avatar URL"
            rules={[
              {
                type: "url",
                message: "Vui lòng nhập URL hợp lệ",
                warningOnly: true,
              },
            ]}
          >
            <Input prefix={<LinkOutlined />} placeholder="https://..." />
          </Form.Item>

          <Form.Item className="mb-0!">
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
