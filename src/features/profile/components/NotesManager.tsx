"use client";

import {
  Card,
  DatePicker,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Popconfirm,
  Space,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useNotes, useDeleteNote } from "@/hooks/useProfileData";
import { NoteModal } from "./NoteModal";
import type { Note, NotesFilter } from "@/types";

const { RangePicker } = DatePicker;

const KNOWN_SYMBOLS = [
  "VNM", "VIC", "VHM", "HPG", "FPT",
  "MBB", "MSN", "VCB", "TCB", "SSI",
  "VRE", "SAB", "GAS", "PLX", "BVH",
  "ACB", "STB", "TPB", "VPB", "HDB",
];

export function NotesManager() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<NotesFilter>({ page: 1, limit: 20 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { data, isLoading } = useNotes(filters);
  const deleteMutation = useDeleteNote();

  const notes = data?.notes || [];
  const meta = data?.meta;

  const handleDateRange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
  ) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      startDate: dates?.[0]?.startOf("day").toISOString(),
      endDate: dates?.[1]?.endOf("day").toISOString(),
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Xóa ghi chú thành công");
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "noteDate",
      key: "noteDate",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (text: string) =>
        text.length > 80 ? `${text.slice(0, 80)}...` : text,
    },
    {
      title: "Mã CP",
      dataIndex: "stockSymbol",
      key: "stockSymbol",
      width: 100,
      render: (symbol?: string) =>
        symbol ? <Tag color="blue">{symbol}</Tag> : "—",
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_: unknown, record: Note) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingNote(record);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa ghi chú này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Ghi chú"
        className="bg-gray-800/50! border-gray-700!"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingNote(null);
              setModalOpen(true);
            }}
          >
            Thêm ghi chú
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap gap-3">
          <RangePicker
            format="DD/MM/YYYY"
            onChange={handleDateRange}
            placeholder={["Từ ngày", "Đến ngày"]}
            allowClear
          />
          <Select
            placeholder="Mã cổ phiếu"
            allowClear
            style={{ width: 140 }}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                stockSymbol: value || undefined,
              }))
            }
            options={[
              ...KNOWN_SYMBOLS.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Input
            placeholder="Tìm theo tiêu đề..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 220 }}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                search: e.target.value || undefined,
              }))
            }
          />
        </div>

        <Table
          dataSource={notes}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          size="small"
          pagination={{
            current: meta?.page || filters.page,
            pageSize: meta?.limit || filters.limit,
            total: meta?.total || 0,
            showSizeChanger: false,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
          locale={{ emptyText: "Chưa có ghi chú nào" }}
        />
      </Card>

      <NoteModal
        open={modalOpen}
        note={editingNote}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
      />
    </div>
  );
}
