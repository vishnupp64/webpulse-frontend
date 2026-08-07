import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useWebsite } from "../context/WebsiteContext";

export default function WebsiteSelector() {
  const { websites, current, select } = useWebsite();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onClick={() => setOpen((o) => !o)}
      >
        <Globe className="h-4 w-4 shrink-0 text-brand-500" />
        <span className="truncate">{current ? current.name : "Select website"}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 max-h-80 w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {websites.length === 0 && (
            <p className="px-4 py-3 text-sm text-slate-400">No websites yet</p>
          )}
          {websites.map((w) => (
            <button
              key={w.id}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${
                current?.id === w.id ? "bg-brand-50 text-brand-700" : "text-slate-700"
              }`}
              onClick={() => {
                select(w.id);
                setOpen(false);
              }}
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{w.name}</div>
                <div className="truncate text-xs text-slate-400">{w.domain}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}