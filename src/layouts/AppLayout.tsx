import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";
import { websiteApi } from "../services";
import { errorMessage } from "../services/api";
import {
  LayoutDashboard, Radio, LayoutTemplate, Users, Zap, Target, Share2, Monitor,
  Settings, LogOut, Menu, X, Gauge, CalendarDays, FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWebsite } from "../context/WebsiteContext";
import { useDateRange } from "../context/DateRangeContext";
import WebsiteSelector from "./WebsiteSelector";
import DateRangeSelector from "./DateRangeSelector";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/realtime", label: "Realtime", icon: Radio },
  { to: "/pages", label: "Pages", icon: LayoutTemplate },
  { to: "/visitors", label: "Visitors", icon: Users },
  { to: "/events", label: "Events", icon: Zap },
  { to: "/conversions", label: "Conversions", icon: Target },
  { to: "/sources", label: "Sources", icon: Share2 },
  { to: "/devices", label: "Devices", icon: Monitor },
  { to: "/report", label: "Report", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { current, refresh } = useWebsite();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    try {
      const { website } = await websiteApi.create({ name, domain });
      toast("Website created", "success");
      setOpen(false);
      setName("");
      setDomain("");
      await refresh();
      navigate(`/websites/${website.id}/install`);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
    }`;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <Gauge className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-slate-900">WebPulse</div>
          <div className="text-xs text-slate-400">Analytics</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <div className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {(user?.name?.[0] || "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-slate-800">{user?.name}</div>
            <div className="truncate text-xs text-slate-400">{user?.email}</div>
          </div>
        </div>
        <button
          className="btn btn-secondary w-full"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 border-r border-slate-200 bg-white lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white shadow-xl">{sidebar}</aside>
          <button className="absolute left-64 top-4 text-slate-200" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <button className="btn-secondary p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <WebsiteSelector />
          </div>
          <DateRangeSelector />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {current ? (
            <Outlet />
          ) : (
            <EmptyWebsites onCreate={() => setOpen(true)} />
          )}
        </main>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add website"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={create} disabled={busy || !name || !domain}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {busy ? "Creating..." : "Create"}
            </button>
          </>
        }
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name && domain) create();
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-700">Website name</label>
            <input
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My SaaS app"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Domain</label>
            <input
              className="input mt-1"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
            />
            <p className="mt-1 text-xs text-slate-400">
              Without protocol (e.g. <code className="text-slate-500">myapp.com</code>), or with subdomain/path.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function EmptyWebsites({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 text-5xl">📡</div>
      <h2 className="text-xl font-semibold text-slate-800">No website selected</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Create your first website to start collecting analytics and see your dashboard.
      </p>
      <button className="btn btn-primary mt-6" onClick={onCreate}>Create website</button>
    </div>
  );
}