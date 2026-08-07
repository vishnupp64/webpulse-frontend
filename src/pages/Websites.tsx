import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2, Code2 } from "lucide-react";
import { Card } from "../components/Card";
import { DataTable } from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useWebsite } from "../context/WebsiteContext";
import { useToast } from "../context/ToastContext";
import { websiteApi } from "../services";
import { errorMessage } from "../services/api";
import { formatDate } from "../utils/format";
import type { Website } from "../types";

export default function WebsitesPage() {
  const { websites, refresh } = useWebsite();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [open, setOpen] = useState(params.get("new") === "1");
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [delTarget, setDelTarget] = useState<Website | null>(null);

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

  async function remove() {
    if (!delTarget) return;
    setBusy(true);
    try {
      await websiteApi.remove(delTarget.id);
      toast("Website deleted", "success");
      await refresh();
      setDelTarget(null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Websites"
        subtitle="Manage the sites you track"
        actions={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus /> Add website
          </button>
        }
      />

      <Card>
        <DataTable
          emptyMessage="No websites yet. Add your first website to get a tracking code."
          columns={[
            {
              key: "name",
              header: "Name",
              render: (w: Website) => (
                <div>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-slate-400">{w.domain}</div>
                </div>
              ),
            },
            { key: "trackingId", header: "Tracking ID" },
            { key: "createdAt", header: "Created", render: (w: Website) => formatDate(w.createdAt) },
            {
              key: "actions",
              header: "",
              render: (w: Website) => (
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/websites/${w.id}/install`} className="btn btn-secondary !px-2.5 !py-1.5" title="Install code">
                    <Code2 className="h-4 w-4" />
                  </Link>
                  <Link to={`/settings?site=${w.id}`} className="text-sm text-brand-600 hover:underline">
                    Settings
                  </Link>
                  <button className="btn btn-secondary !px-2.5 !py-1.5 text-red-600" onClick={() => setDelTarget(w)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          rows={websites}
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add website"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={create} disabled={busy || !name || !domain}>
              {busy ? "Creating..." : "Create"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Website name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Site" />
          </div>
          <div>
            <label className="label">Domain</label>
            <input className="input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        title="Delete website"
        message={`This will permanently delete "${delTarget?.name}" and all of its analytics data. This cannot be undone.`}
        onConfirm={remove}
        onCancel={() => setDelTarget(null)}
        busy={busy}
      />
    </div>
  );
}