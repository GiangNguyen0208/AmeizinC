export interface VietnamHoliday {
  day: number;
  month: number;
  name: string;
  greeting: string;
}

const VIETNAM_HOLIDAYS: VietnamHoliday[] = [
  {
    day: 30,
    month: 4,
    name: "Ngày Giải phóng miền Nam, thống nhất đất nước",
    greeting: "Chúc mừng Ngày Giải phóng miền Nam, thống nhất đất nước 30/4",
  },
  {
    day: 1,
    month: 5,
    name: "Ngày Quốc tế Lao động",
    greeting: "Chúc mừng Ngày Quốc tế Lao động 1/5",
  },
  {
    day: 2,
    month: 9,
    name: "Ngày Quốc khánh",
    greeting: "Chúc mừng Ngày Quốc khánh Việt Nam 2/9",
  },
];

export function getVietnamHoliday(date: Date = new Date()): VietnamHoliday | null {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return VIETNAM_HOLIDAYS.find((holiday) => holiday.day === day && holiday.month === month) ?? null;
}
