import type { Region } from "./types";

const noise = (a: number, b: number) => { const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return x - Math.floor(x); };

// SAMPLE climate grid: temperature (degrees C) and variance from the previous-years average. Deterministic.
// Replace with gridded forecast and climatology from the API.
export function cellClimate(r: Region, lat: number, lng: number) {
  const [w, s, e, n] = r.bbox;
  const d = Math.min(1, Math.hypot((lat - r.lat) / ((n - s) / 2), (lng - r.lng) / ((e - w) / 2)));
  const anomaly = (1.1 + r.intensity * 2.6) * (1 - 0.5 * d) + (noise(lat, lng) - 0.5) * 0.8;
  const temp = 34 + r.intensity * 4 - Math.abs(lat) * 0.3 + (noise(lng, lat) - 0.5) * 3;
  return { temp, anomaly };
}
