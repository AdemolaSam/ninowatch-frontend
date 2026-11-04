"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingBlock } from "@/components/common/States";
import { SCALES, gradientCss, scaleColor } from "@/lib/colors";
import { useClimate, useCountries } from "@/lib/queries";
import { ACTIVE_THEME } from "@/lib/theme";
import type { Climate, Country, Incident, Region } from "@/lib/types";

type Layer = "variance" | "temperature";

const WIDTH = 1000;
const HEIGHT = 560;
const RASTER_WIDTH = 250;
const RASTER_HEIGHT = 140;

function valueAt(data: Climate, layer: Layer, screenRow: number, col: number): number | null {
  const row = Math.max(0, Math.min(data.rows - 1, screenRow));
  const column = Math.max(0, Math.min(data.cols - 1, col));
  const cell = data.cells[(data.rows - 1 - row) * data.cols + column];
  return layer === "temperature" ? cell?.temp ?? null : cell?.anomaly ?? null;
}

function sample(data: Climate, layer: Layer, x: number, y: number): number | null {
  const fx = Math.max(0, Math.min(data.cols - 1, x * data.cols - 0.5));
  const fy = Math.max(0, Math.min(data.rows - 1, y * data.rows - 0.5));
  const left = Math.floor(fx), top = Math.floor(fy);
  const right = Math.min(data.cols - 1, left + 1);
  const bottom = Math.min(data.rows - 1, top + 1);
  const nearest = valueAt(data, layer, Math.round(fy), Math.round(fx));
  if (nearest === null) return null;
  const a = valueAt(data, layer, top, left);
  const b = valueAt(data, layer, top, right);
  const c = valueAt(data, layer, bottom, left);
  const d = valueAt(data, layer, bottom, right);
  if (a === null || b === null || c === null || d === null) return nearest;
  const tx = fx - left, ty = fy - top;
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

function drawSurface(canvas: HTMLCanvasElement, data: Climate, layer: Layer) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const image = ctx.createImageData(RASTER_WIDTH, RASTER_HEIGHT);
  const scale = layer === "variance" ? SCALES[ACTIVE_THEME].anomaly : SCALES[ACTIVE_THEME].temp;
  for (let y = 0; y < RASTER_HEIGHT; y++) {
    for (let x = 0; x < RASTER_WIDTH; x++) {
      const value = sample(data, layer, (x + 0.5) / RASTER_WIDTH, (y + 0.5) / RASTER_HEIGHT);
      const offset = (y * RASTER_WIDTH + x) * 4;
      const color = value === null
        ? ((x + y) % 12 < 2 ? [70, 75, 78] : [49, 54, 57])
        : scaleColor(scale, value).match(/\d+/g)?.map(Number) ?? [49, 54, 57];
      image.data[offset] = color[0];
      image.data[offset + 1] = color[1];
      image.data[offset + 2] = color[2];
      image.data[offset + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

function countryPath(country: Country, x: (lng: number) => number, y: (lat: number) => number): string {
  return country.polys.map((polygon) => polygon.map((ring) =>
    ring.map(([lng, lat], index) => `${index ? "L" : "M"}${x(lng).toFixed(1)},${y(lat).toFixed(1)}`).join(" ") + " Z"
  ).join(" ")).join(" ");
}

export function RegionMap({ region, incidents }: { region: Region; incidents: Incident[] }) {
  const climate = useClimate(region.id);
  const countries = useCountries();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [layer, setLayer] = useState<Layer>("temperature");
  const [info, setInfo] = useState("Move over the map to inspect the source samples.");
  const data = climate.data;
  const hasVariance = data?.cells.some((cell) => cell.anomaly !== null) ?? false;
  const activeLayer = layer === "variance" && !hasVariance ? "temperature" : layer;
  const outlines = useMemo(() => {
    if (!data || !countries.data) return [];
    const [west, south, east, north] = data.bbox;
    const x = (lng: number) => ((lng - west) / (east - west)) * WIDTH;
    const y = (lat: number) => ((north - lat) / (north - south)) * HEIGHT;
    return countries.data.filter((country) => country.polys.some((polygon) =>
      polygon.some((ring) => ring.some(([lng, lat]) =>
        lng >= west - 5 && lng <= east + 5 && lat >= south - 5 && lat <= north + 5
      ))
    )).map((country) => ({ id: country.id, path: countryPath(country, x, y) }));
  }, [data, countries.data]);

  useEffect(() => {
    if (canvas.current && data) drawSurface(canvas.current, data, activeLayer);
  }, [data, activeLayer]);

  if (climate.isPending) return <div className="p-4"><LoadingBlock /></div>;
  if (climate.isError || !data) return <div className="glass m-4 text-sm">Live climate grid is not available for this area yet. The seasonal outlook remains available.</div>;

  const [west, south, east, north] = data.bbox;
  const X = (lng: number) => ((lng - west) / (east - west)) * WIDTH;
  const Y = (lat: number) => ((north - lat) / (north - south)) * HEIGHT;
  const scale = activeLayer === "variance" ? SCALES[ACTIVE_THEME].anomaly : SCALES[ACTIVE_THEME].temp;
  const missing = data.cells.filter((cell) => cell.anomaly === null).length;

  function inspect(clientX: number, clientY: number, rect: DOMRect) {
    if (!data) return;
    const x = Math.max(0, Math.min(0.999999, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(0.999999, (clientY - rect.top) / rect.height));
    const col = Math.floor(x * data.cols);
    const row = data.rows - 1 - Math.floor(y * data.rows);
    const cell = data.cells[row * data.cols + col];
    if (!cell) return;
    setInfo(`${cell.temp.toFixed(1)}°C forecast at ${cell.lat.toFixed(1)}°, ${cell.lng.toFixed(1)}°; ${cell.anomaly === null ? "historical baseline unavailable" : `${cell.anomaly >= 0 ? "+" : ""}${cell.anomaly.toFixed(1)}°C versus ${data.baselineYears}`}`);
  }

  return <div className="flex h-full min-h-0 flex-col gap-2 p-2">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="label">Climate map: {region.name}</p>
        <p className="text-xs text-muted">Open-Meteo forecast · smoothed display of {data.cols} × {data.rows} samples</p>
      </div>
      <div className="flex gap-2" role="group" aria-label="Map layer">
        <button className="btn" aria-pressed={activeLayer === "temperature"} onClick={() => setLayer("temperature")}>Temperature</button>
        <button className="btn" aria-pressed={activeLayer === "variance"} disabled={!hasVariance}
          title={hasVariance ? "Compare with the historical baseline" : "Historical baseline is not available yet"}
          onClick={() => setLayer("variance")}>Variance</button>
      </div>
    </div>
    <div className="glass relative min-h-0 flex-1 overflow-hidden !p-0">
      <canvas ref={canvas} width={RASTER_WIDTH} height={RASTER_HEIGHT} className="absolute inset-0 h-full w-full"
        onPointerMove={(event) => inspect(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())} />
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none"
        role="img" aria-label={`${activeLayer} climate map with country boundaries for ${region.name}`}>
        {outlines.map((country) => <path key={country.id} d={country.path}
          fill="none" stroke="rgba(255,255,255,.56)" strokeWidth={1.2} strokeLinejoin="round" />)}
        {incidents.filter((item) => item.lng >= west && item.lng <= east && item.lat >= south && item.lat <= north).map((item) =>
          <circle key={item.id} cx={X(item.lng)} cy={Y(item.lat)} r={6} fill="#fff" stroke="#111" strokeWidth={2} />)}
      </svg>
    </div>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      <span>{scale.min}°C</span>
      <span className="h-2 min-w-28 flex-1 rounded-sm" style={{ background: gradientCss(scale) }} aria-hidden />
      <span>{scale.max}°C</span>
      {activeLayer === "variance" && missing > 0 && <span>Striped: baseline unavailable ({missing} of {data.cells.length} samples)</span>}
      {!hasVariance && <span>Historical comparison is temporarily unavailable.</span>}
    </div>
    <p className="text-xs text-muted">{info} · Updated {new Date(data.generatedAt).toLocaleString()}.</p>
  </div>;
}
