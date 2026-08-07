export function formatNumber(n: number | undefined | null): string {
  if (n === null || n === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function formatCompact(n: number | undefined | null): string {
  if (n === null || n === undefined) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatPercent(n: number | undefined | null): string {
  if (n === null || n === undefined) return "0%";
  return `${Math.round(n * 10) / 10}%`;
}

export function formatDuration(seconds: number | undefined | null): string {
  if (!seconds) return "0s";
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatRelative(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function percentChange(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

export function sourceLabel(s: string): string {
  const map: Record<string, string> = {
    direct: "Direct",
    organic: "Organic Search",
    referral: "Referral",
    social: "Social",
    email: "Email",
    other: "Other",
  };
  return map[s] ?? s;
}