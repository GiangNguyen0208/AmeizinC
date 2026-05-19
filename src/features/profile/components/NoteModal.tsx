"use client";

import { Modal, Form, Input, DatePicker, AutoComplete, App } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useCreateNote, useUpdateNote } from "@/hooks/useProfileData";
import type { Note } from "@/types";

const KNOWN_SYMBOLS = [
  "VNM", "VIC", "VHM", "HPG", "FPT",
  "MBB", "MSN", "VCB", "TCB", "SSI",
  "VRE", "SAB", "GAS", "PLX", "BVH",
  "ACB", "STB", "TPB", "VPB", "HDB",
];

interface NoteModalProps {
  open: boolean;
  note: Note | null;
  onClose: () => void;
}

export function NoteModal({ open, note, onClose }: NoteModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const loading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (note) {
        form.setFieldsValue({
          title: note.title,
          content: note.content,
          stockSymbol: note.stockSymbol || "",
          noteDate: dayjs(note.noteDate),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ noteDate: dayjs() });
      }
    }
  }, [open, note, form]);

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const payload = {
        title: values.title as string,
        content: values.content as string,
        stockSymbol: (values.stockSymbol as string) || undefined,
        noteDate: values.noteDate
          ? (values.noteDate as dayjs.Dayjs).toISOString()
          : undefined,
      };

      if (note) {
        await updateMutation.mutateAsync({ id: note._id, data: payload });
        message.success("Cập nhật ghi chú thành công");
      } else {
        await createMutation.mutateAsync(payload);
        message.success("Tạo ghi chú thành công");
      }
      onClose();
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  return (
    <Modal
      title={note ? "Sửa ghi chú" : "Thêm ghi chú"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={note ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề" },
            { max: 200, message: "Tối đa 200 ký tự" },
          ]}
        >
          <Input placeholder="Tiêu đề ghi chú" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung" },
            { max: 5000, message: "Tối đa 5000 ký tự" },
          ]}
        >
          <Input.TextArea rows={6} placeholder="Nội dung ghi chú..." />
        </Form.Item>

        <Form.Item name="stockSymbol" label="Mã cổ phiếu (tùy chọn)">
          <AutoComplete
            options={KNOWN_SYMBOLS.map((s) => ({ value: s }))}
            placeholder="VD: VNM, FPT..."
            filterOption={(input, option) =>
              (option?.value as string)
                .toUpperCase()
                .includes(input.toUpperCase())
            }
            allowClear
          />
        </Form.Item>

        <Form.Item name="noteDate" label="Ngày">
          <DatePicker
            format="DD/MM/YYYY"
            className="w-full"
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
