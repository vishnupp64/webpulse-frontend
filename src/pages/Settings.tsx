import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/Card";
import Modal from "../components/Modal";
import { useWebsite } from "../context/WebsiteContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { websiteApi, conversionApi } from "../services";
import { api, errorMessage } from "../services/api";
import type { ConversionGoal, Website } from "../types";

export default function SettingsPage() {
  const { websites, current, refresh } = useWebsite();
  const { user } = useAuth();
  const { toast } = useToast();
  const [params] = useSearchParams();

  const siteParam = params.get("site");
  const selected: Website | null = siteParam
    ? websites.find((w) => w.id === Number(siteParam)) ?? null
    : current;

  // ---- website settings ----
  const [name, setName] = useState(selected?.name ?? "");
  const [domain, setDomain] = useState(selected?.domain ?? "");
  const [timezone, setTimezone] = useState(selected?.timezone ?? "UTC");
  const [respectDnt, setRespectDnt] = useState(selected?.respectDnt ?? true);
  const [trackEvents, setTrackEvents] = useState(selected?.trackEvents ?? true);
  const [siteSaving, setSiteSaving] = useState(false);

  // ---- account ----
  const [accName, setAccName] = useState(user?.name ?? "");
  const [accEmail, setAccEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ---- goals ----
  const [goals, setGoals] = useState<ConversionGoal[]>([]);
  const [goalModal, setGoalModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalEvent, setGoalEvent] = useState("");

  const loadGoals = useCallback(
    async (websiteId?: number) => {
      if (!selected) return;
      const res = await conversionApi.list(selected.id);
      setGoals(res.goals);
    },
    [selected]
  );

  const loadWeb = useCallback(() => {
    if (!selected) return;
    setName(selected.name);
    setDomain(selected.domain);
    setTimezone(selected.timezone);
    setRespectDnt(selected.respectDnt);
    setTrackEvents(selected.trackEvents);
    void loadGoals(selected.id);
  }, [selected, loadGoals]);

  useEffect(() => {
    void loadWeb();
  }, [loadWeb]);

  async function saveSite() {
    if (!selected) return;
    setSiteSaving(true);
    try {
      await websiteApi.update(selected.id, { name, domain, timezone, respectDnt, trackEvents });
      toast("Website settings saved", "success");
      await refresh();
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setSiteSaving(false);
    }
  }

  async function saveAccount() {
    try {
      await api.put("/api/auth/profile", { name: accName, email: accEmail });
      toast("Profile updated", "success");
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  async function changePassword() {
    try {
      await api.put("/api/auth/password", { currentPassword, newPassword });
      toast("Password updated", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  async function createGoal() {
    if (!selected || !goalName || !goalEvent) return;
    try {
      await conversionApi.create({ websiteId: selected.id, name: goalName, eventName: goalEvent });
      toast("Conversion goal created", "success");
      setGoalModal(false);
      setGoalName("");
      setGoalEvent("");
      await loadGoals();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  async function deleteGoal(id: number) {
    try {
      await conversionApi.remove(id);
      toast("Goal deleted", "success");
      await loadGoals();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Settings" subtitle="Website and account configuration" />

      <div className="space-y-6">
        <Card title="Website settings" action={selected ? <span className="text-sm text-slate-400">{selected.trackingId}</span> : undefined}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Domain</label>
                  <input className="input" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Timezone</label>
                <input className="input" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="UTC" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={respectDnt} onChange={(e) => setRespectDnt(e.target.checked)} />
                  Respect "Do Not Track" (don't collect from these visitors)
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={trackEvents} onChange={(e) => setTrackEvents(e.target.checked)} />
                  Enable custom event tracking
                </label>
              </div>
              <button className="btn btn-primary" onClick={saveSite} disabled={siteSaving}>
                {siteSaving ? "Saving..." : "Save website settings"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Create a website to configure it.</p>
          )}
        </Card>

        <Card title="Conversion goals" action={
          <button className="btn btn-secondary" onClick={() => setGoalModal(true)}><Plus /> Add goal</button>
        }>
          {goals.length === 0 ? (
            <p className="text-sm text-slate-400">No conversion goals. Track actions like signups or purchases.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {goals.map((g) => (
                <li key={g.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-slate-800">{g.name}</div>
                    <div className="text-xs text-slate-400">event: {g.eventName}</div>
                  </div>
                  <button className="text-sm text-red-500 hover:underline" onClick={() => deleteGoal(g.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Account settings">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input className="input" value={accName} onChange={(e) => setAccName(e.target.value)} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={accEmail} onChange={(e) => setAccEmail(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-secondary" onClick={saveAccount}>Save profile</button>
            <hr className="border-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Current password</label>
                <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div>
                <label className="label">New password</label>
                <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-secondary" onClick={changePassword}>Change password</button>
          </div>
        </Card>
      </div>

      <Modal open={goalModal} onClose={() => setGoalModal(false)} title="New conversion goal" footer={
        <>
          <button className="btn btn-secondary" onClick={() => setGoalModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={createGoal} disabled={!goalName || !goalEvent}>Create</button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="label">Goal name</label>
            <input className="input" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="e.g. Purchase" />
          </div>
          <div>
            <label className="label">Event name</label>
            <input className="input" value={goalEvent} onChange={(e) => setGoalEvent(e.target.value)} placeholder="e.g. purchase" />
          </div>
        </div>
      </Modal>
    </div>
  );
}