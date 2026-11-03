import type { Advisory, Incident, OutletPackage, Region } from "./types";

// Real figures: University of Chicago Climate Impact Lab projection, to Feb 2027 (modeled, not counts).
export const HEAT_DEATHS = {
  global: 451_000,
  top: [
    { name: "Nigeria", value: 31_400 },
    { name: "Indonesia", value: 19_300 },
    { name: "Sudan", value: 17_600 },
  ],
};

const en = { code: "en", label: "English" };
// Sample data. Risk levels and incidents are placeholders until the API exists.
export const regions: Region[] = [
  { id: "sahel-nigeria", names: ["Nigeria","Niger","Chad","Sudan","Mali","Burkina Faso"], bbox: [-17, 2, 40, 24], intensity: 0.95, heat: [62, 74, 88, 95, 90], countries: [{ name: "Nigeria", value: 31_400 }, { name: "Sudan", value: 17_600 }, { name: "Niger", value: 10_000 }, { name: "Chad", value: 8_000 }], name: "Nigeria and the Sahel", risk: "extreme", lat: 12, lng: 8, languages: [en, { code: "ha", label: "Hausa" }, { code: "yo", label: "Yoruba" }, { code: "pcm", label: "Pidgin" }] },
  { id: "southeast-asia", names: ["Indonesia","Philippines","Vietnam","Thailand","Cambodia","Malaysia","Myanmar","Laos"], bbox: [92, -11, 128, 24], intensity: 0.75, heat: [55, 63, 72, 80, 78], countries: [{ name: "Indonesia", value: 19_300 }, { name: "Philippines, Vietnam, Thailand, Cambodia (combined)", value: 19_400 }], name: "Southeast Asia", risk: "high", lat: 5, lng: 110, languages: [en, { code: "id", label: "Bahasa" }, { code: "tl", label: "Tagalog" }, { code: "vi", label: "Vietnamese" }, { code: "th", label: "Thai" }, { code: "km", label: "Khmer" }] },
  { id: "east-africa", names: ["Kenya","Ethiopia","Somalia","Tanzania","Uganda","S. Sudan"], bbox: [28, -12, 52, 16], intensity: 0.6, heat: [40, 48, 60, 66, 62], name: "East Africa", risk: "high", lat: 1, lng: 38, languages: [en, { code: "sw", label: "Swahili" }] },
  { id: "southern-africa", names: ["South Africa","Zimbabwe","Zambia","Mozambique","Botswana","Namibia","Malawi","Angola"], bbox: [10, -35, 42, -5], intensity: 0.45, heat: [35, 44, 55, 60, 58], name: "Southern Africa", risk: "moderate", lat: -20, lng: 25, languages: [en] },
  { id: "central-america", names: ["Guatemala","Honduras","El Salvador","Nicaragua","Costa Rica","Panama","Belize"], bbox: [-93, 6, -76, 19], intensity: 0.4, heat: [38, 42, 50, 56, 52], name: "Central America", risk: "moderate", lat: 14, lng: -87, languages: [en, { code: "es", label: "Spanish" }] },
  { id: "andean-coast", names: ["Peru","Ecuador"], bbox: [-84, -20, -68, 5], intensity: 0.4, heat: [30, 40, 52, 58, 55], name: "Andean coast", risk: "moderate", lat: -8, lng: -78, languages: [en, { code: "es", label: "Spanish" }] },
];

export const incidents: Incident[] = [
  { id: "i1", regionId: "sahel-nigeria", lat: 12.3, lng: 9, title: "[Heat deaths reported, place A]", status: "confirmed", evidence: "Health ministry statement and weather data match" },
  { id: "i2", regionId: "east-africa", lat: 2, lng: 37, title: "[Crop failure reported, place B]", status: "corroborated", evidence: "Two independent outlets, weather plausible" },
  { id: "i3", regionId: "southeast-asia", lat: 6, lng: 105, title: "[Single-source report, place C]", status: "unverified", evidence: "Awaiting a second source" },
  { id: "i4", regionId: "sahel-nigeria", lat: 13.2, lng: 5.5, title: "[Crop failure reported, place D]", status: "corroborated", evidence: "Two independent outlets, weather plausible" },
  { id: "i5", regionId: "sahel-nigeria", lat: 14, lng: 30, title: "[Heat illness reported, place E]", status: "unverified", evidence: "Awaiting a second source" },
];

export function advisory(regionId: string, lang: string): Advisory {
  return {
    regionId, lang, available: lang === "en",
    happening: "Dangerous heat is forecast.",
    atRisk: "Outdoor workers, farmers, older people, young children.",
    actions: "Avoid direct sun from 11:00 to 16:00. Drink water often. Check on older neighbours.",
  };
}

export function outletPackage(regionId: string, lang: string): OutletPackage {
  return {
    regionId, lang, available: lang === "en",
    radioScript: "Heat warning for [region]. Temperatures will stay dangerously high this week. Stay indoors from 11 in the morning to 4 in the afternoon. Drink water often, and check on older neighbours. Source: NiñoWatch verified reports.",
    sms: "HEAT WARNING [Region]: stay indoors 11am-4pm, drink water, check on elders. More: [link]",
  };
}

// Sample data for the insight charts. Replace with API data.
export const FUNNEL = [
  { label: "Reports ingested", value: 1240 },
  { label: "Events extracted", value: 410 },
  { label: "Corroborated", value: 132 },
  { label: "Confirmed", value: 47 },
];
export const NINO34 = [0.4, 0.8, 1.2, 1.7, 2.0, 2.2];
export const HEAT_MONTHS = "Oct to Feb";
