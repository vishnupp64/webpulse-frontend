import { useState } from "react";
import { Users, MousePointerClick, Eye, Timer, Percent, Target, Activity } from "lucide-react";
import StatCard from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { Card } from "../components/Card";
import { TrafficChart, DonutChart, BarList } from "../components/Charts";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useDashboardData } from "../hooks/useAnalytics";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";
import { formatDuration, formatPercent, sourceLabel } from "../utils/format";
import type { Metric } from "../types";

const METRICS: Metric[] = ["visitors", "sessions", "pageviews"];

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
          {Array.from({ length: 7 }).map((_, i) => <CardSkeleton key={i} rows={1} />)}
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
                    {m[0].toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            }
          >
            {series.loading ? <CardSkeleton /> : series.error ? <ErrorState message={series.error} onRetry={series.reload} /> : series.data ? <TrafficChart data={series.data} /> : null}
          </Card>
        </div>

        <Card title="Devices">
          {devices.loading ? <CardSkeleton /> : devices.error ? <ErrorState message={devices.error} /> : devices.data ? <DonutChart items={devices.data.map((d) => ({ name: d.name, value: d.visitors }))} /> : null}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="Top Pages">
          {topPages.loading ? <CardSkeleton /> : topPages.error ? <ErrorState message={topPages.error} /> : topPages.data ? (
            <DataTable
              columns={[
                { key: "page", header: "Page" },
                { key: "views", header: "Views" },
                { key: "visitors", header: "Visitors" },
              ]}
              rows={topPages.data.slice(0, 6)}
            />
          ) : null}
        </Card>

        <Card title="Traffic Sources">
          {sources.loading ? <CardSkeleton /> : sources.error ? <ErrorState message={sources.error} /> : sources.data ? (
            <BarList
              items={sources.data.map((s) => ({ name: sourceLabel(s.source), pageViews: s.pageViews }))}
            />
          ) : null}
        </Card>
      </div>
    </div>
  );
}