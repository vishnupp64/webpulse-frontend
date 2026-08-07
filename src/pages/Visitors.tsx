import { Card } from "../components/Card";
import { DataTable } from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";

export default function Visitors() {
  const p = useQueryParams();
  const countries = useQuery(() => analyticsApi.countries(p), true, [p]);

  return (
    <div>
      <PageHeader title="Visitors" subtitle="The people visiting your site" />
      {countries.loading ? (
        <CardSkeleton />
      ) : countries.error ? (
        <ErrorState message={countries.error} onRetry={countries.reload} />
      ) : countries.data && countries.data.length > 0 ? (
        <Card title="By country">
          <DataTable
            columns={[
              { key: "name", header: "Country" },
              { key: "visitors", header: "Visitors" },
              { key: "sessions", header: "Sessions" },
              { key: "pageViews", header: "Page Views" },
            ]}
            rows={countries.data}
          />
        </Card>
      ) : (
        <EmptyState
          title="No visitor data yet"
          description="Country insights appear once your tracking script is live."
        />
      )}
    </div>
  );
}