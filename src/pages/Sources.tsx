import { Card } from "../components/Card";
import { DataTable } from "../components/DataTable";
import { BarList } from "../components/Charts";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";
import { sourceLabel } from "../utils/format";

export default function Sources() {
  const p = useQueryParams();
  const sources = useQuery(() => analyticsApi.sources(p), true, [p]);

  return (
    <div>
      <PageHeader title="Traffic Sources" subtitle="Where your visitors come from" />
      {sources.loading ? (
        <CardSkeleton rows={6} />
      ) : sources.error ? (
        <ErrorState message={sources.error} onRetry={sources.reload} />
      ) : sources.data && sources.data.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Breakdown">
            <BarList items={sources.data.map((s) => ({ name: sourceLabel(s.source), pageViews: s.pageViews }))} />
          </Card>
          <Card title="Details">
            <DataTable
              columns={[
                { key: "source", header: "Source", render: (r) => sourceLabel(r.source) },
                { key: "sessions", header: "Sessions" },
                { key: "visitors", header: "Visitors" },
                { key: "pageViews", header: "Page Views" },
              ]}
              rows={sources.data}
            />
          </Card>
        </div>
      ) : (
        <EmptyState title="No traffic data" description="Sources will appear once visitors start viewing your site." />
      )}
    </div>
  );
}