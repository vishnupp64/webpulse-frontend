import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { useDateRange } from "../context/DateRangeContext";
import { RANGE_OPTIONS } from "../types";

export default function DateRangeSelector() {
  const { rangeKey, setRangeKey, startDate, endDate, applyCustom } = useDateRange();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = RANGE_OPTIONS.find((r) => r.key === rangeKey)?.label ?? "Last 7 days";

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onClick={() => setOpen((o) => !o)}
      >
        <Calendar className="h-4 w-4 text-slate-400" />
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.key}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                rangeKey === r.key ? "bg-brand-50 font-medium text-brand-700" : "text-slate-700"
              }`}
              onClick={() => {
                setRangeKey(r.key);
                setOpen(false);
              }}
            >
              {r.label}
            </button>
          ))}
          {rangeKey === "custom" && (
            <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
              <div>
                <label className="label text-xs">Start</label>
                <input type="date" className="input" value={startDate} onChange={(e) => applyCustom(e.target.value, endDate)} />
              </div>
              <div>
                <label className="label text-xs">End</label>
                <input type="date" className="input" value={endDate} onChange={(e) => applyCustom(startDate, e.target.value)} />
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  setRangeKey("custom");
                  setOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}