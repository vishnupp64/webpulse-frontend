import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { DataTable } from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState } from "../components/States";
import { useWebsite } from "../context/WebsiteContext";
import { analyticsApi } from "../services";
import { errorMessage } from "../services/api";
import { formatRelative } from "../utils/format";
import type { Realtime } from "../types";

export default function RealtimePage() {
  const { current } = useWebsite();
  const [data, setData] = useState<Realtime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await analyticsApi.realtime(current.id);
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 12000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [current?.id]);

  return (
    <div>
      <PageHeader title="Realtime" subtitle="Who is on your site right now (polls every ~12s)" />

      {loading && !data ? (
        <CardSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error} />
      ) : data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card
            title={<span className="flex items-center gap-2"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" /> Active visitors</span>}
            action={<span className="text-3xl font-bold text-slate-900">{data.activeVisitors}</span>}
          >
            <h4 className="mb-2 text-sm font-medium text-slate-500">Pages currently viewed</h4>
            <DataTable
              columns={[
                { key: "page", header: "Page" },
                { key: "count", header: "Visitors" },
              ]}
              rows={data.pages.length > 0 ? data.pages : [{ page: "—", count: 0 }]}
            />
          </Card>
          <Card title="Recent activity">
            <DataTable
              columns={[
                { key: "page", header: "Page" },
                { key: "country", header: "Country" },
                { key: "device", header: "Device" },
                { key: "lastActivity", header: "Last Activity", render: (r) => formatRelative(r.lastActivity) },
              ]}
              rows={data.items.slice(0, 12)}
              emptyMessage="No active visitors right now"
            />
          </Card>
        </div>
      ) : (
        <p className="text-center text-sm text-slate-400">Waiting for traffic...</p>
      )}
    </div>
  );
}