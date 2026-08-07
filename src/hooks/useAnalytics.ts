import { useState, useEffect, useCallback, DependencyList } from "react";
import { analyticsApi, QueryParams } from "../services";
import { errorMessage } from "../services/api";

export interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Loads data via `fetcher`, re-running whenever `enabled` or any entry in
 * `deps` changes. `reload()` forces a refetch.
 */
export function useQuery<T>(fetcher: () => Promise<T>, enabled = true, deps: DependencyList = []): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, reload };
}

/** Convenience bundle for dashboard pages using the active website + date range. */
export function useDashboardData(p: QueryParams) {
  const enabled = p.websiteId > 0;
  const deps = [p.websiteId, p.rangeKey, p.startDate, p.endDate];
  return {
    overview: useQuery(() => analyticsApi.overview(p), enabled, deps),
    topPages: useQuery(() => analyticsApi.topPages(p), enabled, deps),
    sources: useQuery(() => analyticsApi.sources(p), enabled, deps),
    devices: useQuery(() => analyticsApi.devices(p), enabled, deps),
  };
}