import { GlassCard } from "@/components/common/GlassCard";
import type { Outlook, Region } from "@/lib/types";

export function RegionRanking({ regions, outlooks, selectedId, onSelect }: { regions: Region[]; outlooks: Outlook[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return <GlassCard className="space-y-1">
    <p className="label mb-2">Outlook areas</p>
    {regions.map((r) => <button key={r.id} onClick={() => onSelect(r.id)} aria-pressed={r.id === selectedId}
      className={`block min-h-11 w-full border-t border-[var(--separator)] px-2 py-1.5 text-left hover:bg-white/10 ${r.id === selectedId ? "bg-white/15" : ""}`}>
      <span className="flex justify-between gap-2 text-sm"><span>{r.name}</span><span className="text-right text-muted">{outlooks.find((item) => item.regionId === r.id)?.hazard ?? "No assessment"}</span></span>
    </button>)}
  </GlassCard>;
}
