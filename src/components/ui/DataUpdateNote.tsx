"use client";

import { Alert } from "antd";

export function DataUpdateNote() {
  return (
    <Alert
      type="info"
      showIcon
      closable
      message="Lịch cập nhật dữ liệu"
      description={
        <ul style={{ margin: "4px 0 0", paddingLeft: 20, lineHeight: 1.8 }}>
          <li>
            <strong>Trong giờ giao dịch </strong> (9:00 &ndash; 11:30 &amp;
            13:00 &ndash; 15:00, Thứ 2 &ndash; Thứ 6): dữ liệu tự động cập
            nhật <strong>mỗi 15 phút</strong> để bạn theo dõi biến động thị
            trường.
          </li>
          <li>
            <strong>Ngoài giờ giao dịch</strong> (buổi tối, cuối tuần, nghỉ
            lễ): hệ thống chạy <strong> 1 lần cuối ngày </strong> để chốt dữ liệu
            &mdash; giá không còn biến động.
          </li>
        </ul>
      }
    />
  );
}
