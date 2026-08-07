import { DataTable } from "../components/DataTable";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";
import { CardSkeleton } from "../components/Skeleton";
import { ErrorState, EmptyState } from "../components/States";
import { useQueryParams } from "../hooks/useQueryParams";
import { useQuery } from "../hooks/useAnalytics";
import { analyticsApi } from "../services";

interface FunnelStep {
  id: number;
  name: string;
  eventName: string;
  count: number;
  users: number;
}

export default function Conversions() {
  const p = useQueryParams();
  const conversions = useQuery<FunnelStep[]>(() => analyticsApi.conversions(p), true, [p]);

  const goals = conversions.data ?? [];
  const topUsers = goals.length > 0 ? goals[0].users : 0;

  return (
    <div>
      <PageHeader title="Conversions" subtitle="Tracked conversion goals and funnel" />
      {conversions.loading ? (
        <CardSkeleton rows={4} />
      ) : conversions.error ? (
        <ErrorState message={conversions.error} onRetry={conversions.reload} />
      ) : goals.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Conversion funnel">
            <ol className="space-y-4">
              {goals.map((g, i) => {
                const prevUsers = i === 0 ? topUsers : goals[i - 1].users;
                const stepUser = g.users;
                const pctOfTotal = topUsers ? Math.round((stepUser / topUsers) * 100) : 0;
                const drop = i === 0 ? 0 : Math.round(((prevUsers - stepUser) / Math.max(1, prevUsers)) * 100);
                return (
                  <li key={g.id}>
                    <div className="mb-1 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800">{g.name}</div>
                        <div className="text-xs text-slate-400">event: {g.eventName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">{g.users.toLocaleString()} users</div>
                        <div className="text-xs text-slate-400">{pctOfTotal}% of first step</div>
                      </div>
                    </div>
                    <div className="h-8 w-full overflow-hidden rounded-md bg-slate-100">
                      <div
                        className="flex h-full items-center justify-center rounded-md bg-brand-500 text-xs font-medium text-white"
                        style={{ width: `${Math.max(pctOfTotal, 2)}%` }}
                      >
                        {pctOfTotal}%
                      </div>
                    </div>
                    {i > 0 && (
                      <div className="mt-1 text-xs text-red-500">Drop-off: {drop}% from previous step</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </Card>
          <Card title="Goal table">
            <DataTable
              columns={[
                { key: "name", header: "Goal" },
                { key: "eventName", header: "Event" },
                { key: "count", header: "Total Events" },
                { key: "users", header: "Unique Users" },
              ]}
              rows={goals}
            />
          </Card>
        </div>
      ) : (
        <EmptyState
          title="No conversion goals"
          description="Create conversion goals in Settings to track signups, purchases, and other key actions."
        />
      )}
    </div>
  );
}