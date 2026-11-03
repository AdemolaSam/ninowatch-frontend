import { ArrowLeft, Radio } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/common/GlassCard";
import { LoadingBlock } from "@/components/common/States";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { useAdvisory, useOutlooks } from "@/lib/queries";
import type { Incident, Region } from "@/lib/types";

export function RegionDetail({ region, incidents, onBack }: { region: Region; incidents: Incident[]; onBack: () => void }) {
  const advisory = useAdvisory(region.id, "en");
  const outlook = useOutlooks().data?.find((item) => item.regionId === region.id);
  return (
    <>
      <GlassCard className="space-y-2">
        <div className="flex items-center justify-between">
          <button className="btn" onClick={onBack}><ArrowLeft size={16} aria-hidden /> Global summary</button>
          <span className="text-xs text-muted">Seasonal outlook area</span>
        </div>
        <h2 className="text-2xl font-light">{region.name}</h2>
        {outlook && <p className="text-sm leading-relaxed"><b className="font-semibold">Seasonal outlook:</b> {outlook.summary} <a className="underline" href={outlook.sourceUrl} target="_blank" rel="noreferrer">{outlook.source}</a></p>}
        {advisory.isPending ? <LoadingBlock lines={2} /> : advisory.data && (
          <p className="text-sm leading-relaxed"><b className="font-semibold">Now:</b> {advisory.data.happening} {advisory.data.actions}</p>
        )}
        {advisory.isError && <p className="text-xs text-muted">Local advisory is not available for this area yet.</p>}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={`/region/${region.id}`} className="btn btn-primary">Full advisory</Link>
          <Link href={`/outlet/${region.id}`} className="btn"><Radio size={16} aria-hidden /> Broadcaster pack</Link>
        </div>
      </GlassCard>
      <GlassCard className="space-y-3">
        <p className="label">Reports by evidence</p>
        {incidents.map((i) => (
          <div key={i.id}><VerificationBadge status={i.status} /><p className="mt-1 text-sm">{i.title}</p><p className="text-xs text-muted">{i.evidence}</p></div>
        ))}
        {incidents.length === 0 && <p className="text-sm text-muted">No reports for this region yet.</p>}
      </GlassCard>
    </>
  );
}
