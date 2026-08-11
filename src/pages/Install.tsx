import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Copy, Check, Loader2, ShieldCheck, ShieldX, ArrowLeft } from "lucide-react";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";
import { useToast } from "../context/ToastContext";
import { websiteApi } from "../services";
import { errorMessage } from "../services/api";
import type { WebsiteSummary } from "../types";

export default function Install() {
  const { id } = useParams();
  const websiteId = Number(id);
  const { toast } = useToast();
  const [website, setWebsite] = useState<WebsiteSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const trackerBase =
    import.meta.env.VITE_TRACKER_URL ||
    (import.meta.env.DEV ? "http://localhost:4000" : "https://webpulse-backend-3ty9.onrender.com");

  const script = `<script
  src="${trackerBase}/tracker.js"
  data-website-id="${website?.trackingId ?? "wp_xxxxx"}"
  data-url="${trackerBase}"
  defer>
</script>`;

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await websiteApi.summary(websiteId);
        if (!cancelled) setWebsite(res.summary);
      } catch (e) {
        toast(errorMessage(e), "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    check();
    const id = setInterval(check, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteId]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("Script copied", "success");
    } catch {
      toast("Could not copy - please copy manually", "error");
    }
  }

  const installed = website?.installStatus === "installed";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Install WebPulse Analytics"
        subtitle={website ? `${website.name} (${website.domain})` : "Loading website..."}
        actions={
          <Link to="/websites" className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" /> All websites
          </Link>
        }
      />

      <Card title="Installation status">
        <div className="flex items-center gap-3">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              <span className="text-sm text-slate-500">Checking...</span>
            </>
          ) : installed ? (
            <>
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <span className="font-medium text-emerald-700">Installed ✓</span>
              <span className="text-sm text-slate-400">We detected data coming from your site.</span>
            </>
          ) : (
            <>
              <ShieldX className="h-6 w-6 text-amber-500" />
              <span className="font-medium text-amber-700">Not detected ✗</span>
              <span className="text-sm text-slate-400">We haven't seen any data yet. Install the script below.</span>
            </>
          )}
        </div>
      </Card>

      <div className="mt-6 space-y-6">
        <Card title="Step 1 — Copy this script">
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{script}</pre>
            <button
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-600"
              onClick={copy}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Script"}
            </button>
          </div>
        </Card>

        <Card title="Step 2 — Paste it before </head>">
          <p className="text-sm text-slate-600">
            Open the HTML of your site and paste the script just before the closing{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">&lt;/head&gt;</code> tag.
          </p>
        </Card>

        <Card title="Step 3 — Visit your website">
          <p className="text-sm text-slate-600">
            Load any page of your site. The tracker automatically records the page view and visitor info.
          </p>
        </Card>

        <Card title="Step 4 — Check your dashboard">
          <p className="text-sm text-slate-600">
            Within a few seconds your dashboard will start showing live traffic. This page refreshes its status
            automatically every 15 seconds.
          </p>
        </Card>

        <Card title="Track custom events">
          <p className="text-sm text-slate-600">
            Once the script is loaded you can fire events from any page script:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
{`analytics.track("signup");
analytics.track("purchase", { value: 99, currency: "USD" });
analytics.track("button_click", { button: "Get Started" });`}
          </pre>
        </Card>
      </div>
    </div>
  );
}