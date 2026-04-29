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
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
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
  if (value > 0) return "#22c55e";
  if (value < 0) return "#ef4444";
  return "#fbbf24";
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

export function isTradingHours(): boolean {
  const now = new Date();
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const utcDay = now.getUTCDay();

  let vnH = utcH + 7;
  let vnDay = utcDay;
  if (vnH >= 24) {
    vnH -= 24;
    vnDay = (vnDay + 1) % 7;
  }
  if (vnDay === 0 || vnDay === 6) return false;

  const vnMinutes = vnH * 60 + utcM;
  return (vnMinutes >= 540 && vnMinutes <= 690) || (vnMinutes >= 780 && vnMinutes <= 900);
}
