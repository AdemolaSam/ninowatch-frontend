import type { Advisory, Climate, CommunityReport, Country, Incident, Outlook, OutletPackage, Region, ReportInput } from "./types";

const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}/api${path}`, { cache: "no-store", ...init });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const getRegions = () => api<Region[]>("/regions");
export const getRegion = (id: string) => api<Region>(`/regions/${encodeURIComponent(id)}`);
export const getOutlooks = () => api<Outlook[]>("/outlooks");
export const getClimate = (regionId: string) => api<Climate>(`/regions/${encodeURIComponent(regionId)}/climate`);
export const getIncidents = async (regionId?: string): Promise<Incident[]> => {
  if (regionId) return api<Incident[]>(`/incidents?regionId=${encodeURIComponent(regionId)}`);
  const regions = await getRegions();
  return (await Promise.all(regions.map((region) => getIncidents(region.id)))).flat();
};
export const getAdvisory = (regionId: string, lang: string) =>
  api<Advisory>(`/advisories/${encodeURIComponent(regionId)}?lang=${encodeURIComponent(lang)}`);
export const getOutletPackage = (regionId: string, lang: string) =>
  api<OutletPackage>(`/outlet-packs/${encodeURIComponent(regionId)}?lang=${encodeURIComponent(lang)}`);
export const getReports = (regionId?: string) =>
  api<CommunityReport[]>(`/reports${regionId ? `?regionId=${encodeURIComponent(regionId)}` : ""}`);
export const submitReport = (input: ReportInput) => api<{ id: number; status: string }>("/reports", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
});
export const getCountries = async (): Promise<Country[]> => (await fetch("/data/countries.json")).json();
