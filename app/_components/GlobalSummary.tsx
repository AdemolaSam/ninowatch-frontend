import { GlassCard } from "@/components/common/GlassCard";
import type { Incident, Outlook, Region } from "@/lib/types";

export function GlobalSummary({ regions, incidents, outlooks }: { regions: Region[]; incidents: Incident[]; outlooks: Outlook[] }) {
  const stats = [
    { label: "Outlook areas", value: outlooks.length },
    { label: "Regions listed", value: regions.length },
    { label: "Verified reports", value: incidents.filter((i) => i.status !== "unverified").length },
    { label: "Awaiting more evidence", value: incidents.filter((i) => i.status === "unverified").length },
  ];
  return <>
    <GlassCard>
      <p className="label">Global summary</p>
      <p className="mt-1 text-2xl font-light">Seasonal hazards worldwide</p>
      <p className="text-xs text-muted">Published outlooks indicate areas to watch. Other areas have no assessment here. An outlook is not an observed incident.</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {stats.map((s) => <div key={s.label}><dd className="text-2xl font-light">{s.value}</dd><dt className="text-xs text-muted">{s.label}</dt></div>)}
      </dl>
    </GlassCard>
    <GlassCard className="space-y-3">
      <p className="label">Published outlooks</p>
      {outlooks.map((item) => <div key={item.regionId} className="border-t border-[var(--separator)] pt-2 text-sm">
        <p className="font-semibold">{regions.find((region) => region.id === item.regionId)?.name ?? item.regionId}: {item.hazard}</p>
        <p>{item.summary}</p>
        <a className="text-xs underline" href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source}, issued {item.issuedAt}</a>
      </div>)}
    </GlassCard>
  </>;
}
