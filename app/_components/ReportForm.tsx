"use client";

import { useState } from "react";
import { submitReport } from "@/lib/api";
import type { Incident } from "@/lib/types";
import { GlassCard } from "@/components/common/GlassCard";

export function ReportForm({ regionId, incidents }: { regionId: string; incidents: Incident[] }) {
  const [incidentId, setIncidentId] = useState("");
  const [kind, setKind] = useState("heat");
  const [placeName, setPlaceName] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [description, setDescription] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await submitReport({
        regionId, kind, placeName, description,
        ...(incidentId ? { incidentId: Number(incidentId) } : {}),
        ...(occurredAt ? { occurredAt } : {}),
        ...(sourceUrl ? { sourceUrl } : {}),
      });
      setMessage("Thank you. Your report is pending review and is not yet public.");
      setDescription("");
      setSourceUrl("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit report.");
    } finally {
      setBusy(false);
    }
  }

  return <GlassCard>
    <h2 className="label">Share local evidence</h2>
    <p className="mb-3 text-xs text-muted">Submit an observation or add evidence to a report. A reviewer checks it before it appears. Do not include names or contact details.</p>
    <form onSubmit={submit} className="space-y-2 text-sm">
      <label className="block">Related incident
        <select className="mt-1 w-full bg-black/30 p-2" value={incidentId} onChange={(e) => setIncidentId(e.target.value)}>
          <option value="">New report</option>
          {incidents.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      <label className="block">Type
        <select className="mt-1 w-full bg-black/30 p-2" value={kind} onChange={(e) => setKind(e.target.value)}>
          {["heat", "flood", "drought", "wildfire", "disease", "crop", "other"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <label className="block">Place<input className="mt-1 w-full bg-black/30 p-2" required minLength={2} maxLength={256} value={placeName} onChange={(e) => setPlaceName(e.target.value)} /></label>
      <label className="block">Date, if known<input className="mt-1 w-full bg-black/30 p-2" type="date" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} /></label>
      <label className="block">What happened?<textarea className="mt-1 w-full bg-black/30 p-2" required minLength={20} maxLength={2000} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <label className="block">Source link, if available<input className="mt-1 w-full bg-black/30 p-2" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} /></label>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Submit for review"}</button>
      {message && <p role="status" className="text-xs">{message}</p>}
    </form>
  </GlassCard>;
}
