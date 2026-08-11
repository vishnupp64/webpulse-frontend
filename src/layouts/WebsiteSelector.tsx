import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Plus, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWebsite } from "../context/WebsiteContext";

export default function WebsiteSelector({ onAddWebsite }: { onAddWebsite?: () => void }) {
  const { websites, current, select } = useWebsite();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
                current?.id === w.id ? "bg-brand-50 font-medium text-brand-700" : "text-slate-700"
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
          <div className="border-t border-slate-100 p-1.5 space-y-0.5 bg-slate-50/50">
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-brand-600 hover:bg-brand-50"
              onClick={() => {
                setOpen(false);
                if (onAddWebsite) onAddWebsite();
                else navigate("/websites?new=1");
              }}
            >
              <Plus className="h-4 w-4" /> Add website
            </button>
            <Link
              to="/websites"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              <Layers className="h-3.5 w-3.5 text-slate-400" /> Manage all websites
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}