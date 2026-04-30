"use client";

import { Alert } from "antd";
import { getVietnamHoliday } from "@/services";

export function VietnamHolidayNotice() {
  const holiday = getVietnamHoliday();

  if (!holiday) return null;

  return (
    <Alert
      type="success"
      showIcon
      message={
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl leading-none" aria-label="Quốc kỳ Việt Nam" role="img">
            🇻🇳
          </span>
          <span>{holiday.greeting}</span>
        </div>
      }
      description={
        <div className="space-y-1">
          <p className="m-0 font-medium text-gray-100">{holiday.name}</p>
          <p className="m-0">
            Đang nghỉ lễ mấy fen ơi, đợi qua lễ rồi thị trường hoạt động ổn định lại nghen !!!
          </p>
        </div>
      }
    />
  );
}
