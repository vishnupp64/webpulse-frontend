import { Card } from "../components/Card";
import { DataTable } from "../components/DataTable";
import { DonutChart } from "../components/Charts";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";

export default function Devices() {
  const p = useQueryParams();
  const devices = useQuery(() => analyticsApi.devices(p), true, [p]);
  const browsers = useQuery(() => analyticsApi.browsers(p), true, [p]);
  const os = useQuery(() => analyticsApi.operatingSystems(p), true, [p]);

  return (
    <div>
      <PageHeader title="Devices" subtitle="How visitors access your site" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Device type">
          {devices.loading ? (
            <CardSkeleton />
          ) : devices.error ? (
            <ErrorState message={devices.error} onRetry={devices.reload} />
          ) : devices.data && devices.data.length > 0 ? (
            <DonutChart items={devices.data.map((d) => ({ name: d.name, value: d.visitors }))} />
          ) : (
            <EmptyState title="No data" description="No device data collected yet." />
          )}
        </Card>
        <Card title="Browsers">
          {browsers.loading ? (
            <CardSkeleton />
          ) : browsers.error ? (
            <ErrorState message={browsers.error} onRetry={browsers.reload} />
          ) : browsers.data && browsers.data.length > 0 ? (
            <DataTable columns={[{ key: "name", header: "Browser" }, { key: "visitors", header: "Visitors" }]} rows={browsers.data} />
          ) : (
            <EmptyState title="No data" description="No browser data collected yet." />
          )}
        </Card>
        <Card title="Operating systems">
          {os.loading ? (
            <CardSkeleton />
          ) : os.error ? (
            <ErrorState message={os.error} onRetry={os.reload} />
          ) : os.data && os.data.length > 0 ? (
            <DataTable columns={[{ key: "name", header: "OS" }, { key: "visitors", header: "Visitors" }]} rows={os.data} />
          ) : (
            <EmptyState title="No data" description="No OS data collected yet." />
          )}
        </Card>
      </div>
    </div>
  );
}