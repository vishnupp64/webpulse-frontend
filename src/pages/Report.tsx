import { useState } from "react";
import { Card } from "../components/Card";
import { DataTable } from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useWebsite } from "../context/WebsiteContext";
import { useQuery } from "../hooks/useAnalytics";
import { reportApi } from "../services";
import { formatDate, sourceLabel } from "../utils/format";
import type { Report } from "../types";

const RANGES = [
  { key: "7d", label: "7-day report" },
  { key: "30d", label: "30-day report" },
  { key: "90d", label: "90-day report" },
];

export default function ReportPage() {
  const { current } = useWebsite();
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const report = useQuery<Report>(
    () => (current ? reportApi.get(current.id, range) : Promise.reject("no website")),
    !!current,
    [current?.id, range]
  );

  const changed = report.data?.summary;

  return (
    <div>
      <PageHeader
        title="Report"
        subtitle="A readable summary of performance"
        actions={
          <div className="flex rounded-lg border border-slate-200 text-xs">
            {RANGES.map((r) => (
              <button
                key={r.key}
                className={`px-3 py-1.5 font-medium ${range === r.key ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => setRange(r.key as "7d" | "30d" | "90d")}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {report.loading ? (
        <CardSkeleton rows={5} />
      ) : report.error ? (
        <ErrorState message={report.error} onRetry={report.reload} />
      ) : report.data ? (
        <div className="space-y-4">
          <Card title="Highlights">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Visitors", value: changed?.visitors, pct: changed?.visitorsChangePct },
                { label: "Sessions", value: changed?.sessions, pct: changed?.sessionsChangePct },
                { label: "Page Views", value: changed?.pageViews, pct: changed?.pageViewsChangePct },
                { label: "Conversions", value: changed?.conversions, pct: null },
              ].map((c) => (
                <div key={c.label} className="rounded-lg border border-slate-100 p-4">
                  <div className="text-sm text-slate-500">{c.label}</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{(c.value ?? 0).toLocaleString()}</div>
                  {c.pct !== null && c.pct !== undefined && (
                    <div className={`text-xs ${c.pct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {c.pct >= 0 ? "+" : ""}{c.pct}%
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Conversion rate: {report.data.summary.conversionRate}% · Bounce rate: {report.data.summary.bounceRate}%
            </p>
          </Card>

          <Card title="Top pages">
            <DataTable columns={[{ key: "page", header: "Page" }, { key: "views", header: "Views" }, { key: "visitors", header: "Visitors" }]} rows={report.data.topPages} />
          </Card>

          <Card title="Traffic sources">
            <DataTable columns={[{ key: "source", header: "Source", render: (r) => sourceLabel(r.source) }, { key: "pageViews", header: "Page Views" }, { key: "visitors", header: "Visitors" }]} rows={report.data.sources} />
          </Card>

          <Card title="Devices">
            <DataTable columns={[{ key: "name", header: "Device" }, { key: "visitors", header: "Visitors" }]} rows={report.data.devices} />
          </Card>
        </div>
      ) : (
        <EmptyState title="No report yet" description="Send some traffic to your site to generate a report." />
      )}
    </div>
  );
}