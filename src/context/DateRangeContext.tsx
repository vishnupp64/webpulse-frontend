import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";
import type { RangeKey } from "../types";

interface DateRangeContextValue {
  rangeKey: RangeKey;
  setRangeKey: (r: RangeKey) => void;
  startDate: string;
  endDate: string;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  applyCustom: (start: string, end: string) => void;
}

const DateRangeContext = createContext<DateRangeContextValue | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [rangeKey, setRangeKey] = useState<RangeKey>("7d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const applyCustom = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const value = useMemo(
    () => ({ rangeKey, setRangeKey, startDate, endDate, setStartDate, setEndDate, applyCustom }),
    [rangeKey, startDate, endDate, applyCustom]
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange(): DateRangeContextValue {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
}