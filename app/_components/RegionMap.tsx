"use client";

import { useState } from "react";
import { LoadingBlock } from "@/components/common/States";
import { SCALES, scaleColor } from "@/lib/colors";
import { useClimate } from "@/lib/queries";
import { ACTIVE_THEME } from "@/lib/theme";
import type { Incident, Region } from "@/lib/types";

type Layer = "variance" | "temperature";

export function RegionMap({ region, incidents }: { region: Region; incidents: Incident[] }) {
  const climate = useClimate(region.id);
  const [layer, setLayer] = useState<Layer>("variance");
  const [info, setInfo] = useState("Select a cell or incident for details.");
  if (climate.isPending) return <div className="p-4"><LoadingBlock /></div>;
  if (climate.isError) return <div className="glass m-4 text-sm">Live climate grid is not available for this area yet. The seasonal outlook remains available.</div>;

  const data = climate.data;
  const [w, s, e, n] = data.bbox;
  const W = 1000, H = 560;
  const dx = W / data.cols, dy = H / data.rows;
  const X = (lng: number) => ((lng - w) / (e - w)) * W;
  const Y = (lat: number) => ((n - lat) / (n - s)) * H;
  const scale = layer === "variance" ? SCALES[ACTIVE_THEME].anomaly : SCALES[ACTIVE_THEME].temp;

  return <div className="flex h-full min-h-0 flex-col gap-2 p-2">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="label">Live climate grid: {region.name}</p>
      <div className="flex gap-2" role="group" aria-label="Map layer">
        <button className="btn" aria-pressed={layer === "variance"} onClick={() => setLayer("variance")}>Variance</button>
        <button className="btn" aria-pressed={layer === "temperature"} onClick={() => setLayer("temperature")}>Temperature</button>
      </div>
    </div>
    <div className="glass min-h-0 flex-1 !p-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${layer} grid for ${region.name}`}>
        {data.cells.map((cell, index) => <rect key={index} x={X(cell.lng) - dx / 2} y={Y(cell.lat) - dy / 2} width={dx + 1} height={dy + 1}
          fill={cell.anomaly === null && layer === "variance" ? "#777" : scaleColor(scale, layer === "variance" ? cell.anomaly ?? 0 : cell.temp)}
          onPointerEnter={() => setInfo(`${cell.temp.toFixed(1)}°C; ${cell.anomaly === null ? "baseline unavailable" : `${cell.anomaly >= 0 ? "+" : ""}${cell.anomaly.toFixed(1)}°C versus ${data.baselineYears}`}.`)}
          onPointerDown={() => setInfo(`${cell.temp.toFixed(1)}°C; ${cell.anomaly === null ? "baseline unavailable" : `${cell.anomaly >= 0 ? "+" : ""}${cell.anomaly.toFixed(1)}°C versus ${data.baselineYears}`}.`)} />)}
        {incidents.filter((item) => item.lng >= w && item.lng <= e && item.lat >= s && item.lat <= n).map((item) =>
          <circle key={item.id} cx={X(item.lng)} cy={Y(item.lat)} r={8} fill="#fff" stroke="#000" strokeWidth={2}
            onPointerEnter={() => setInfo(`${item.title}: ${item.status}. ${item.evidence}`)}
            onPointerDown={() => setInfo(`${item.title}: ${item.status}. ${item.evidence}`)} />)}
      </svg>
    </div>
    <p className="text-xs text-muted">{info} Updated {new Date(data.generatedAt).toLocaleString()}.</p>
  </div>;
}
