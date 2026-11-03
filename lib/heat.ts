import type { Region, Risk } from "./types";

export interface HotPoint { lat: number; lng: number; alt: number; w: number; regionId: string; risk: Risk }

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sample heat-stress points around each region. Deterministic, so the globe looks the same on every load.
// Replace with gridded anomaly data from the API.
export function hotPoints(regions: Region[]): HotPoint[] {
  return regions.flatMap((r, i) => {
    const rand = rng(i + 7);
    return Array.from({ length: Math.round(10 + 40 * r.intensity) }, () => {
      const w = rand() * r.intensity;
      return { lat: r.lat + (rand() - 0.5) * 18, lng: r.lng + (rand() - 0.5) * 22, alt: 0.01 + w * 0.4, w, regionId: r.id, risk: r.risk };
    });
  });
}
