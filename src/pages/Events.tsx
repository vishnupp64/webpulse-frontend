import { DataTable } from "../components/DataTable";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";
import { formatRelative } from "../utils/format";

export default function Events() {
  const p = useQueryParams();
  const events = useQuery(() => analyticsApi.events(p), true, [p]);

  return (
    <div>
      <PageHeader title="Events" subtitle="Custom events tracked on your site" />
      {events.loading ? (
        <CardSkeleton rows={6} />
      ) : events.error ? (
        <ErrorState message={events.error} onRetry={events.reload} />
      ) : events.data && events.data.length > 0 ? (
        <Card title="All events">
          <DataTable
            columns={[
              { key: "eventName", header: "Event Name" },
              { key: "count", header: "Count" },
              { key: "users", header: "Unique Users" },
              { key: "last", header: "Last Triggered", render: (r) => formatRelative(r.last) },
            ]}
            rows={events.data}
          />
        </Card>
      ) : (
        <EmptyState
          title="No events tracked"
          description="Use analytics.track('event_name', {...}) in your code to record custom events."
        />
      )}
    </div>
  );
}