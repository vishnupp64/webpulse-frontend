import { DataTable } from "../components/DataTable";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";
import { formatDuration } from "../utils/format";

export default function Pages() {
  const p = useQueryParams();
  const pages = useQuery(() => analyticsApi.topPages(p), true, [p]);
  const visitors = useQuery(() => analyticsApi.series(p, "visitors"), true, [p]);

  return (
    <div>
      <PageHeader title="Pages" subtitle="Which pages get the most traffic" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Top pages">
            {pages.loading ? <CardSkeleton /> : pages.error ? <ErrorState message={pages.error} onRetry={pages.reload} /> : pages.data && pages.data.length > 0 ? (
              <DataTable
                columns={[
                  { key: "page", header: "Page" },
                  { key: "views", header: "Views" },
                  { key: "visitors", header: "Unique Visitors" },
                  { key: "avgDuration", header: "Avg Duration", render: (r) => formatDuration(r.avgDuration) },
                  { key: "bounceRate", header: "Bounce Rate", render: () => "—" },
                ]}
                rows={pages.data}
              />
            ) : (
              <EmptyState title="No page views yet" description="Install the tracking script to start collecting data." />
            )}
          </Card>
        </div>
        <Card title="Visitors over time">
          {visitors.loading ? <CardSkeleton /> : <Chart data={[]} />}
        </Card>
      </div>
    </div>
  );
}

function Chart(_props: { data: unknown[] }) {
  return <p className="text-sm text-slate-400">See Dashboard for the traffic trend chart.</p>;
}