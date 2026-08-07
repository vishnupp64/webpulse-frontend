export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Website {
  id: number;
  name: string;
  domain: string;
  trackingId: string;
  timezone: string;
  respectDnt: boolean;
  trackEvents: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSummary extends Website {
  installStatus: "installed" | "not_detected" | "checking";
  totalVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  totalEvents: number;
  lastActivity: string | null;
}

export type RangeKey = "today" | "yesterday" | "7d" | "30d" | "90d" | "custom";
export type Metric = "visitors" | "sessions" | "pageviews";

export interface Overview {
  current: {
    visitors: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversions: number;
    conversionRate: number;
  };
  previous: {
    visitors: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversions: number;
    conversionRate: number;
  };
}

export interface SeriesPoint {
  date: string;
  label: string;
  value: number;
}

export interface TopPage {
  page: string;
  views: number;
  visitors: number;
  avgDuration: number;
  bounceRate: number;
}

export interface SourceRow {
  source: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export interface BreakdownRow {
  name: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export interface EventRow {
  eventName: string;
  count: number;
  users: number;
  last: string;
}

export interface Conversion {
  id: number;
  name: string;
  eventName: string;
  operator: string;
  matchValue?: string | null;
  count: number;
  users: number;
}

export type ConversionRow = Conversion;

export interface ConversionGoal {
  id: number;
  websiteId: number;
  name: string;
  eventName: string;
  operator: string;
  matchValue?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Realtime {
  activeVisitors: number;
  pages: Array<{ page: string; count: number }>;
  items: Array<{
    page: string;
    country: string;
    device: string;
    lastActivity: string;
  }>;
}

export interface Report {
  rangeKey: string;
  startDate: string;
  endDate: string;
  summary: {
    visitors: number;
    sessions: number;
    pageViews: number;
    visitorsChangePct: number;
    sessionsChangePct: number;
    pageViewsChangePct: number;
    conversions: number;
    conversionRate: number;
    bounceRate: number;
  };
  topPages: TopPage[];
  sources: SourceRow[];
  devices: BreakdownRow[];
  conversions: ConversionRow[];
}

export const RANGE_OPTIONS: Array<{ key: RangeKey; label: string }> = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "custom", label: "Custom" },
];

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