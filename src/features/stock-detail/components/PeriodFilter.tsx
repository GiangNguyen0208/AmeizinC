"use client";

import { Segmented, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const PERIOD_OPTIONS = [
  { label: "1 tháng", value: 30 },
  { label: "3 tháng", value: 90 },
  { label: "6 tháng", value: 180 },
  { label: "1 năm", value: 365 },
];

export type DateRange = {
  startDate: string; // ISO string
  endDate: string;   // ISO string
};

export type PeriodFilterValue =
  | { mode: "preset"; days: number }
  | { mode: "custom"; range: DateRange };

interface PeriodFilterProps {
  value: PeriodFilterValue;
  onChange: (value: PeriodFilterValue) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const segmentedValue = value.mode === "preset" ? value.days : null;

  const rangeValue: [Dayjs, Dayjs] | null =
    value.mode === "custom"
      ? [dayjs(value.range.startDate), dayjs(value.range.endDate)]
      : null;

  const handleSegmentChange = (val: number) => {
    onChange({ mode: "preset", days: val });
  };

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      onChange({
        mode: "custom",
        range: {
          startDate: dates[0].startOf("day").toISOString(),
          endDate: dates[1].endOf("day").toISOString(),
        },
      });
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Segmented
        options={PERIOD_OPTIONS}
        value={segmentedValue}
        onChange={(val) => handleSegmentChange(val as number)}
      />

      <span className="text-gray-500 select-none">|</span>

      <RangePicker
        format="DD/MM/YYYY"
        value={rangeValue}
        onChange={handleRangeChange}
        disabledDate={(current) => current && current > dayjs().endOf("day")}
        placeholder={["Từ ngày", "Đến ngày"]}
        allowClear
      />
    </div>
  );
}