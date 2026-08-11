import { useState } from "react";
import { Users, MousePointerClick, Percent, Timer, Target, Activity, Sparkles, AlertTriangle } from "lucide-react";
import StatCard from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { Card } from "../components/Card";
import { TrafficChart, DonutChart, BarList } from "../components/Charts";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useDashboardData, useQuery } from "../hooks/useAnalytics";
import { analyticsApi, aiApi, type QueryParams } from "../services";
import { formatDuration, formatPercent, sourceLabel } from "../utils/format";
import type { Metric } from "../types";

const METRICS: Metric[] = ["visitors", "sessions", "pageviews"];

function AiInsightsSection({ p }: { p: QueryParams }) {
  const aiQuery = useQuery(() => aiApi.insights(p), true, [p]);

  if (aiQuery.loading) return <CardSkeleton rows={2} />;
  if (aiQuery.error || !aiQuery.data) return null;

  const data = aiQuery.data;

  return (
    <Card className="mb-6 border-brand-200 bg-gradient-to-r from-brand-50/40 to-slate-50">
      <div className="flex items-center justify-between border-b border-brand-100 pb-3 mb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Sparkles className="h-5 w-5 text-brand-600" />
          <span>🤖 AI Website Insights</span>
        </div>
        <span className="text-xs font-medium text-slate-500">Verified Analytics Data</span>
      </div>

      <p className="text-sm font-medium text-slate-700 mb-4">{data.summary}</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.insights &&
          data.insights.map((item, i) => {
            const isWarning = item.type === "warning";
            const isPositive = item.type === "positive";
            return (
              <div
                key={i}
                className={`rounded-lg p-3.5 border ${
                  isWarning
                    ? "bg-amber-50/80 border-amber-200 text-amber-900"
                    : isPositive
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-blue-50/80 border-blue-200 text-blue-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isWarning ? "⚠️ Attention" : isPositive ? "✅ Growth" : "🎯 Opportunity"}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/70">
                    {item.priority} priority
                  </span>
                </div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-xs opacity-90 leading-relaxed">{item.description}</div>
              </div>
            );
          })}
      </div>

      {data.recommendations && data.recommendations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200/80">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            💡 Recommended Actions
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="rounded-md bg-white p-3 border border-slate-200 shadow-sm text-xs">
                <span className="font-bold text-slate-800">{rec.title}: </span>
                <span className="text-slate-600">{rec.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const p = useQueryParams();
  const { overview, topPages, sources, devices } = useDashboardData(p);
  const [metric, setMetric] = useState<Metric>("visitors");
  const series = useQuery(() => analyticsApi.series(p, metric), true, [p, metric]);

  if (!overview.error && overview.loading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Your site performance at a glance" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <CardSkeleton key={i} rows={1} />
          ))}
        </div>
      </div>
    );
  }

  if (overview.error || !overview.data) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <ErrorState message={overview.error ?? "No data"} onRetry={overview.reload} />
      </div>
    );
  }

  const ov = overview.data;
  const cards = [
    { label: "Visitors", value: ov.current.visitors, prevValue: ov.previous.visitors, icon: <Users className="h-5 w-5" /> },
    { label: "Sessions", value: ov.current.sessions, prevValue: ov.previous.sessions, icon: <Activity className="h-5 w-5" /> },
    { label: "Page Views", value: ov.current.pageViews, prevValue: ov.previous.pageViews, icon: <MousePointerClick className="h-5 w-5" /> },
    { label: "Bounce Rate", value: ov.current.bounceRate, prevValue: ov.previous.bounceRate, format: formatPercent, invert: true, icon: <Percent className="h-5 w-5" /> },
    { label: "Avg Session Duration", value: ov.current.avgSessionDuration, prevValue: ov.previous.avgSessionDuration, format: formatDuration, invert: true, icon: <Timer className="h-5 w-5" /> },
    { label: "Conversions", value: ov.current.conversions, prevValue: ov.previous.conversions, icon: <Target className="h-5 w-5" /> },
    { label: "Conversion Rate", value: ov.current.conversionRate, prevValue: ov.previous.conversionRate, format: formatPercent, icon: <Target className="h-5 w-5" /> },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Real data from your tracking code" />

      {/* AI Insights Section */}
      <AiInsightsSection p={p} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Traffic"
            action={
              <div className="flex rounded-lg border border-slate-200 text-xs">
                {METRICS.map((m) => (
                  <button
                    key={m}
                    className={`px-2.5 py-1 font-medium ${metric === m ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    onClick={() => setMetric(m)}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            }
          >
            {series.loading ? <CardSkeleton /> : series.data ? <TrafficChart data={series.data} /> : null}
          </Card>
        </div>

        <Card title="Top Sources">
          {sources.loading ? <CardSkeleton /> : sources.data ? <BarList items={sources.data.map((s) => ({ ...s, name: sourceLabel(s.source) }))} valueKey="visitors" /> : null}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="Top Pages">
          {topPages.loading ? (
            <CardSkeleton />
          ) : topPages.data ? (
            <DataTable
              columns={[
                { key: "path", header: "Path" },
                { key: "visitors", header: "Visitors" },
                { key: "pageViews", header: "Page Views" },
              ]}
              rows={topPages.data.slice(0, 5)}
            />
          ) : null}
        </Card>

        <Card title="Device Breakdown">
          {devices.loading ? <CardSkeleton /> : devices.data ? <DonutChart items={devices.data.map((d) => ({ name: d.name, value: d.visitors }))} /> : null}
        </Card>
      </div>
    </div>
  );
}