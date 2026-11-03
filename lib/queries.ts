import { useQuery } from "@tanstack/react-query";
import { getAdvisory, getClimate, getCountries, getIncidents, getOutletPackage, getOutlooks, getRegion, getRegions, getReports } from "./api";

export const keys = {
  regions: ["regions"] as const,
  region: (id: string) => ["regions", id] as const,
  incidents: (regionId?: string) => ["incidents", regionId ?? "all"] as const,
  advisory: (id: string, lang: string) => ["advisory", id, lang] as const,
  outlet: (id: string, lang: string) => ["outlet", id, lang] as const,
};

export const useRegions = () => useQuery({ queryKey: keys.regions, queryFn: getRegions });
export const useRegion = (id: string) => useQuery({ queryKey: keys.region(id), queryFn: () => getRegion(id) });
export const useOutlooks = () => useQuery({ queryKey: ["outlooks"], queryFn: getOutlooks });
export const useClimate = (id: string) => useQuery({ queryKey: ["climate", id], queryFn: () => getClimate(id) });
export const useIncidents = (regionId?: string) => useQuery({ queryKey: keys.incidents(regionId), queryFn: () => getIncidents(regionId), refetchInterval: 15000 });
export const useAdvisory = (id: string, lang: string) => useQuery({ queryKey: keys.advisory(id, lang), queryFn: () => getAdvisory(id, lang) });
export const useOutletPackage = (id: string, lang: string) => useQuery({ queryKey: keys.outlet(id, lang), queryFn: () => getOutletPackage(id, lang) });
export const useReports = (regionId?: string) => useQuery({ queryKey: ["reports", regionId ?? "all"], queryFn: () => getReports(regionId) });
export const useCountries = () => useQuery({ queryKey: ["countries"], queryFn: getCountries, staleTime: Infinity });
