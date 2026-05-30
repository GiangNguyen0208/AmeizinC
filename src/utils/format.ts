export function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function formatPrice(value: number): string {
  const vnd = value * 1000;
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(vnd) + "đ";
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) { return `${(value / 1_000_000_000).toFixed(1)}B`; }
  if (value >= 1_000_000) { return `${(value / 1_000_000).toFixed(1)}M`; }
  if (value >= 1_000) { return `${(value / 1_000).toFixed(1)}K`; }
  return value.toString();
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPrice(value)}`;
}

export function getChangeColor(value: number): string {
  if (value > 0) { return "#22c55e"; }
  if (value < 0) { return "#ef4444"; }
  return "#fbbf24";
}

const VN_TZ = "Asia/Ho_Chi_Minh";

function getVnNow(): { hour: number; minute: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VN_TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")!.value);
  const minute = Number(parts.find((p) => p.type === "minute")!.value);
  const weekday = parts.find((p) => p.type === "weekday")!.value;
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return { hour, minute, day: dayMap[weekday] };
}

export function formatRelativeTime(iso: string): string {
  const target = new Date(iso);
  const vnFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: VN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const nowParts = vnFormatter.formatToParts(new Date());
  const tgtParts = vnFormatter.formatToParts(target);
  const toTs = (p: Intl.DateTimeFormatPart[]) => {
    const v = (t: string) => Number(p.find((x) => x.type === t)!.value);
    return new Date(v("year"), v("month") - 1, v("day"), v("hour"), v("minute"), v("second")).getTime();
  };

  const diff = toTs(nowParts) - toTs(tgtParts);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) { return "vừa xong"; }
  if (mins < 60) { return `${mins} phút trước`; }
  const hours = Math.floor(mins / 60);
  if (hours < 24) { return `${hours} giờ trước`; }
  return `${Math.floor(hours / 24)} ngày trước`;
}

export function isTradingHours(): boolean {
  const { hour, minute, day } = getVnNow();
  if (day === 0 || day === 6) { return false; }
  const vnMinutes = hour * 60 + minute;
  return (vnMinutes >= 540 && vnMinutes <= 690) || (vnMinutes >= 780 && vnMinutes <= 900);
}
