import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { percentChange } from "../utils/format";

const defaultFormat = (n: number) =>
  n >= 100 ? Math.round(n).toLocaleString() : String(Math.round(n * 10) / 10);

export interface Stat {
  label: string;
  value: number;
  prevValue: number;
  format?: (n: number) => string;
  invert?: boolean;
  icon?: ReactNode;
}

export default function StatCard({ label, value, prevValue, format, invert, icon }: Stat) {
  const change = percentChange(value, prevValue);
  const isUp = change >= 0;
  const good = invert ? !isUp : isUp;
  const fmt = format ?? defaultFormat;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && <span className="text-slate-300">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{fmt(value)}</div>
      <div className="mt-2 flex items-center gap-1 text-sm">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
            good ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(change)}%
        </span>
        <span className="text-slate-400">vs previous</span>
      </div>
    </div>
  );
}