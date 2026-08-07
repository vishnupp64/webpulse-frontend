import { useMemo } from "react";
import { useWebsite } from "../context/WebsiteContext";
import { useDateRange } from "../context/DateRangeContext";
import type { QueryParams } from "../services";

/** Builds a QueryParams from the active website + date range contexts. */
export function useQueryParams(): QueryParams {
  const { current } = useWebsite();
  const { rangeKey, startDate, endDate } = useDateRange();
  return useMemo(
    () => ({
      websiteId: current?.id ?? 0,
      rangeKey,
      startDate: rangeKey === "custom" ? startDate : undefined,
      endDate: rangeKey === "custom" ? endDate : undefined,
    }),
    [current?.id, rangeKey, startDate, endDate]
  );
}