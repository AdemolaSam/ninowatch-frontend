"use client";
import dynamic from "next/dynamic";
import { LocateFixed } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { ErrorBlock, LoadingBlock } from "@/components/common/States";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { nearestRegion } from "@/lib/geo";
import { useIncidents, useOutlooks, useRegions } from "@/lib/queries";
import { GlobalSummary } from "./_components/GlobalSummary";
import { RegionDetail } from "./_components/RegionDetail";
import { RegionMap } from "./_components/RegionMap";
import { RegionRanking } from "./_components/RegionRanking";

const GlobeView = dynamic(() => import("./_components/GlobeView"), { ssr: false });
const column = "flex min-h-0 flex-col gap-2 lg:overflow-y-auto lg:pb-2";

export default function Home() {
  const regions = useRegions();
  const incidents = useIncidents();
  const outlooks = useOutlooks();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"globe" | "map">("globe");
  const [note, setNote] = useState("");
  const selected = regions.data?.find((r) => r.id === selectedId);
  const shown = (incidents.data ?? []).filter((i) => !selectedId || i.regionId === selectedId);
  const mapView = !!selected && view === "map";
  const select = (id: string | null) => { setSelectedId(id); if (!id) setView("globe"); };

  function locate() {
    navigator.geolocation.getCurrentPosition(
      (p) => select(nearestRegion(regions.data ?? [], p.coords.latitude, p.coords.longitude)?.id ?? null),
      () => setNote("Location is blocked. Select a region on the globe or in the list."),
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-2 p-2 lg:h-screen lg:overflow-hidden">
        <header className="glass flex flex-wrap items-center justify-between gap-2 !px-2 !py-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold">NiñoWatch</h1>
            <span className="bg-risk-extreme px-2 py-0.5 text-xs font-semibold text-accent-fg">El Niño seasonal outlook</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {selected && (
              <div className="flex items-center gap-1.5" role="group" aria-label="View">
                <button className="btn" aria-pressed={view === "globe"} onClick={() => setView("globe")}>Globe</button>
                <button className="btn" aria-pressed={view === "map"} onClick={() => setView("map")}>Region map</button>
              </div>
            )}
            <button className="btn btn-primary" onClick={locate}><LocateFixed size={14} aria-hidden /> Use my location</button>
          </div>
        </header>
        {note && <p role="status" className="glass self-center !py-2 text-sm">{note}</p>}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[minmax(16rem,19rem)_minmax(0,1fr)_minmax(16rem,19rem)]">
          <section className="map-stage relative order-1 min-h-[28rem] overflow-hidden lg:order-2 lg:min-h-0" aria-label={mapView ? "Region map" : "Interactive globe"}>
            {mapView && selected ? <RegionMap region={selected} incidents={shown} /> :
              <GlobeView regions={regions.data ?? []} incidents={incidents.data ?? []} selectedId={selectedId} onSelect={select} />}
          </section>
          <aside className={`${column} order-2 lg:order-1`} aria-label="Climate summary">
            {regions.isPending ? <LoadingBlock /> : regions.isError ? <ErrorBlock message="Could not load regions." onRetry={() => regions.refetch()} /> :
              selected ? <RegionDetail region={selected} incidents={shown} onBack={() => select(null)} /> : <GlobalSummary regions={regions.data} incidents={incidents.data ?? []} outlooks={outlooks.data ?? []} />}
          </aside>
          <aside className={`${column} order-3`} aria-label="Reports and region ranking">
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="label">Report feed</p>
                <span className="text-xs text-muted">Verified news reports</span>
              </div>
              {incidents.isPending && <LoadingBlock lines={2} />}
              {incidents.isError && <ErrorBlock message="Could not load reports." onRetry={() => incidents.refetch()} />}
              {!incidents.isPending && !incidents.isError && shown.length === 0 && <p className="text-sm text-muted">No reports for this region yet.</p>}
              {shown.map((i) => (
                <div key={i.id} className="space-y-1 border-t border-[var(--separator)] pt-2">
                  <VerificationBadge status={i.status} />
                  <p className="text-sm">{i.title}</p>
                  <p className="text-xs text-muted">{selected ? i.evidence : `${regions.data?.find((r) => r.id === i.regionId)?.name ?? "Region unknown"} · ${i.evidence}`}</p>
                </div>
              ))}
            </GlassCard>
            {regions.data && <RegionRanking regions={regions.data} outlooks={outlooks.data ?? []} selectedId={selectedId} onSelect={select} />}
          </aside>
        </div>
    </main>
  );
}
