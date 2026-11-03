"use client";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { Minus, Pause, Play, Plus } from "lucide-react";
import { useCountries } from "@/lib/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Country, Incident, Region } from "@/lib/types";
import { ACTIVE_THEME, themeColors } from "@/lib/theme";
import { MapLegend } from "./MapLegend";

const palette = themeColors[ACTIVE_THEME];

// Mockup look: dark sphere, dotted muted land, theme-lit hotspot countries, a callout with a leader line.
function callout(d: object) {
  const i = d as Incident;
  const box = (css: string, text = "") => Object.assign(document.createElement("div"), { textContent: text, style: css });
  const root = box("position:relative;width:0;height:0;pointer-events:none;font-family:inherit;white-space:nowrap");
  const label = box("position:absolute;right:10px;bottom:96px;text-align:right");
  label.append(
    box(`color:${palette.accent};font-size:12px;font-weight:600;letter-spacing:.12em`, i.title),
    box("color:rgba(255,255,255,.64);font-size:12px", `${i.status[0].toUpperCase()}${i.status.slice(1)}`),
  );
  root.append(label, box("position:absolute;left:0;bottom:8px;width:1px;height:88px;background:rgba(255,255,255,.6)"), box("position:absolute;left:-8px;top:-8px;width:16px;height:16px;border:1.5px solid #fff;border-radius:50%"));
  return root;
}

function useSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 800 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ...size };
}

interface Props { regions: Region[]; incidents: Incident[]; selectedId: string | null; onSelect: (id: string) => void }

export default function GlobeView({ regions, incidents, selectedId, onSelect }: Props) {
  const globe = useRef<GlobeMethods | undefined>(undefined);
  const { ref, w, h } = useSize();
  const [paused, setPaused] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [reduced, setReduced] = useState(false);
  const countries = useCountries();
  const byName = useMemo(() => new Map(regions.flatMap((r) => r.names.map((n) => [n, r.id] as const))), [regions]);
  const featured = !selectedId ? incidents.find((i) => i.status === "confirmed") : undefined;

  useEffect(() => {
    const c = document.createElement("canvas");
    setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const g = globe.current;
    if (!g) return;
    const controls = g.controls();
    controls.autoRotate = !paused && !reduced;
    controls.autoRotateSpeed = 0.6;
    controls.minDistance = 160;
    controls.maxDistance = 600;
    const stop = () => setPaused(true);
    controls.addEventListener("start", stop);
    return () => controls.removeEventListener("start", stop);
  }, [paused, reduced, webgl]);

  useEffect(() => {
    const r = regions.find((x) => x.id === selectedId);
    setPaused(!!r);
    globe.current?.pointOfView(r ? { lat: r.lat, lng: r.lng, altitude: 1.5 } : { altitude: ACTIVE_THEME === "graphite" ? 1.9 : 2.4 }, 1000);
  }, [selectedId, regions]);

  const zoom = (f: number) => {
    const g = globe.current;
    if (g) g.pointOfView({ altitude: Math.min(4, Math.max(0.5, g.pointOfView().altitude * f)) }, 400);
  };

  if (!webgl) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <ul className="glass space-y-2">
          <li className="label">3D globe not supported on this device. Choose a region:</li>
          {regions.map((r) => <li key={r.id}><button className="underline" onClick={() => onSelect(r.id)}>{r.name}</button></li>)}
        </ul>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-full w-full">
      <Globe
        ref={globe}
        width={w}
        height={h}
        globeImageUrl="/data/globe-dark.png"
        backgroundColor="rgba(0,0,0,0)"
        showGraticules={ACTIVE_THEME === "graphite"}
        atmosphereColor={palette.accent}
        atmosphereAltitude={ACTIVE_THEME === "graphite" ? 0.08 : 0.2}
        onGlobeReady={() => {
          const g = globe.current;
          g?.pointOfView({ lat: 12, lng: 20, altitude: ACTIVE_THEME === "graphite" ? 1.9 : 2.4 }, 0);
        }}
        hexPolygonsData={countries.data ?? []}
        hexPolygonGeoJsonGeometry={(d) => ({ type: "MultiPolygon", coordinates: (d as Country).polys }) as never}
        hexPolygonResolution={3}
        hexPolygonMargin={0.5}
        hexPolygonUseDots
        hexPolygonColor={(d) => {
          const rid = byName.get((d as Country).name);
          const active = selectedId && rid === selectedId;
          const rgb = active ? palette.highlightRgb : palette.landRgb;
          const opacity = !rid ? 0.22 : selectedId && !active ? 0.3 : ACTIVE_THEME === "graphite" && !selectedId ? 0.58 : 0.95;
          return `rgba(${rgb},${opacity})`;
        }}
        htmlElementsData={featured ? [featured] : []}
        htmlElement={callout}
        pointsData={regions}
        pointColor={(d) => {
          const region = d as Region;
          const rgb = region.id === selectedId ? palette.highlightRgb : palette.highlightRgb;
          return `rgba(${rgb},${selectedId && region.id !== selectedId ? 0.35 : 1})`;
        }}
        pointAltitude={0.01}
        pointRadius={0.7}
        pointLabel={(d) => (d as Region).name}
        onPointClick={(d) => onSelect((d as Region).id)}
        ringsData={incidents}
        ringColor={() => (t: number) => `rgba(${palette.highlightRgb},${1 - t})`}
        ringMaxRadius={4}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1400}
        labelsData={regions}
        labelText={(d) => (d as Region).name}
        labelSize={0.9}
        labelDotRadius={0.35}
        labelColor={(d) => ((d as Region).id === selectedId ? palette.accent : "rgba(255,255,255,0.75)")}
        labelResolution={2}
        onLabelClick={(d) => onSelect((d as Region).id)}
      />
      <div className="pointer-events-auto absolute inset-x-2 bottom-2 z-20 flex flex-col items-center gap-2">
        <MapLegend />
        <p className="text-center text-xs text-muted">Drag to turn, scroll to zoom, select a hotspot to open it.</p>
        <div className="glass flex items-center gap-2 !p-1.5">
          <button className="btn" aria-label="Zoom out" onClick={() => zoom(1.4)}><Minus size={16} /></button>
          <button className="btn" aria-label="Zoom in" onClick={() => zoom(0.7)}><Plus size={16} /></button>
          <button className="btn" onClick={() => setPaused((p) => !p)}>{paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}{paused ? "Rotate" : "Pause"}</button>
        </div>
      </div>
    </div>
  );
}
