import { api, get, post, put, del, setToken } from "./api";
import type {
  User,
  Website,
  WebsiteSummary,
  Overview,
  SeriesPoint,
  Metric,
  TopPage,
  SourceRow,
  BreakdownRow,
  EventRow,
  ConversionRow,
  ConversionGoal,
  Realtime,
  Report,
  RangeKey,
  AiInsightsResponse,
  AiChatMessage,
  AiReportResponse,
  AnomalyItem,
} from "../types";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    post<{ token: string; user: User }>("/api/auth/register", data),
  login: (data: { email: string; password: string }) =>
    post<{ token: string; user: User }>("/api/auth/login", data),
  logout: () => post<{ message: string }>("/api/auth/logout"),
  me: () => get<{ user: User }>("/api/auth/me"),
};

export const websiteApi = {
  list: () => get<{ websites: Website[] }>("/api/websites"),
  get: (id: number) => get<{ website: Website }>(`/api/websites/${id}`),
  summary: (id: number) => get<{ summary: WebsiteSummary }>(`/api/websites/${id}/summary`),
  create: (data: { name: string; domain: string; timezone?: string }) =>
    post<{ website: Website }>("/api/websites", data),
  update: (id: number, data: Partial<Website>) =>
    put<{ website: Website }>(`/api/websites/${id}`, data),
  remove: (id: number) => del<{ message: string }>(`/api/websites/${id}`),
};

export interface QueryParams {
  websiteId: number;
  rangeKey: RangeKey;
  startDate?: string;
  endDate?: string;
}

function base(p: QueryParams) {
  return { websiteId: p.websiteId, rangeKey: p.rangeKey, startDate: p.startDate, endDate: p.endDate };
}

export const analyticsApi = {
  overview: (p: QueryParams) => get<Overview>("/api/analytics/overview", base(p)),
  series: (p: QueryParams, metric: Metric) =>
    get<SeriesPoint[]>("/api/analytics/series", { ...base(p), metric }),
  topPages: (p: QueryParams) => get<TopPage[]>("/api/analytics/top-pages", base(p)),
  sources: (p: QueryParams) => get<SourceRow[]>("/api/analytics/sources", base(p)),
  devices: (p: QueryParams) => get<BreakdownRow[]>("/api/analytics/devices", base(p)),
  browsers: (p: QueryParams) => get<BreakdownRow[]>("/api/analytics/browsers", base(p)),
  operatingSystems: (p: QueryParams) => get<BreakdownRow[]>("/api/analytics/operating-systems", base(p)),
  countries: (p: QueryParams) => get<BreakdownRow[]>("/api/analytics/countries", base(p)),
  events: (p: QueryParams) => get<EventRow[]>("/api/analytics/events", base(p)),
  conversions: (p: QueryParams) => get<ConversionRow[]>("/api/analytics/conversions", base(p)),
  realtime: (websiteId: number) =>
    get<Realtime>("/api/analytics/realtime", { websiteId }),
  anomalies: (p: QueryParams) => get<AnomalyItem[]>("/api/analytics/anomalies", base(p)),
};

export const conversionApi = {
  list: (websiteId: number) => get<{ goals: ConversionGoal[] }>("/api/conversions", { websiteId }),
  create: (data: { websiteId: number; name: string; eventName: string; operator?: string; matchValue?: string }) =>
    post<{ goal: ConversionGoal }>("/api/conversions", data),
  update: (id: number, data: Partial<ConversionGoal>) =>
    put<{ goal: ConversionGoal }>(`/api/conversions/${id}`, data),
  remove: (id: number) => del<{ message: string }>(`/api/conversions/${id}`),
};

export const reportApi = {
  get: (websiteId: number, range: "7d" | "30d" | "90d") =>
    get<Report>("/api/report", { websiteId, range }),
};

export const aiApi = {
  insights: (p: QueryParams) => post<AiInsightsResponse>("/api/ai/insights", base(p)),
  chat: (p: { websiteId: number; question: string; startDate?: string; endDate?: string }) =>
    post<AiChatMessage>("/api/ai/chat", p),
  report: (p: QueryParams) => post<AiReportResponse>("/api/ai/report", base(p)),
  explainAnomaly: (p: { websiteId: number; anomalyId?: string }) =>
    post<{ anomalies: AnomalyItem[]; explanation: string }>("/api/ai/anomaly-explanation", p),
};

export { setToken };