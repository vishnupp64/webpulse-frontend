import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import type { SeriesPoint } from "../types";

export const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export function TrafficChart({ data, color = "#6366f1" }: { data: SeriesPoint[]; color?: string }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
          <Area type="monotone" dataKey="value" name="value" stroke={color} strokeWidth={2} fill="url(#grad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ items }: { items: Array<{ name: string; value: number }> }) {
  const data = items
    .filter((i) => i.value > 0)
    .map((i) => ({
      name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : "Unknown",
      value: i.value,
    }));
  if (data.length === 0) return <p className="py-10 text-center text-sm text-slate-400">No data</p>;
  const total = data.reduce((s, i) => s + i.value, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-52 w-52 min-w-[13rem] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-600 capitalize">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              {d.name}
            </span>
            <span className="font-medium text-slate-800">
              {total ? Math.round((d.value / total) * 100) : 0}% ({d.value})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({ items, valueKey = "pageViews", format }: {
  items: Array<Record<string, number | string>>;
  valueKey?: string;
  format?: (n: number) => string;
}) {
  const max = Math.max(...items.map((i) => Number(i[valueKey] ?? 0)), 1);
  if (items.length === 0) return <p className="py-8 text-center text-sm text-slate-400">No data</p>;
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const name = item.name ?? item.page ?? item.source ?? "—";
        const val = Number(item[valueKey] ?? 0);
        return (
          <div key={String(name)}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-600">{String(name)}</span>
              <span className="font-medium text-slate-800">
                {format ? format(val) : val.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${(val / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}