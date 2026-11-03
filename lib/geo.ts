import type { Region } from "./types";

const rad = (d: number) => (d * Math.PI) / 180;
function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const h = Math.sin(rad(bLat - aLat) / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(rad(bLng - aLng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}
export function nearestRegion(regions: Region[], lat: number, lng: number): Region | undefined {
  return [...regions].sort((a, b) => km(lat, lng, a.lat, a.lng) - km(lat, lng, b.lat, b.lng))[0];
}
