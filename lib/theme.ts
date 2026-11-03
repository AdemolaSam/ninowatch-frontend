// Change this one value to "ember" to restore the original palette.
export type Theme = "ember" | "ocean" | "graphite";
export const ACTIVE_THEME: Theme = "graphite";

export const themeColors = {
  ember: {
    accent: "#e8a864",
    landRgb: "232,168,100",
    highlightRgb: "232,168,100",
    riskRgb: { moderate: "242,209,107", high: "255,154,60", extreme: "255,90,78" },
    sea: "#000000",
    land: "#0b0b0b",
  },
  ocean: {
    accent: "#75d2cf",
    landRgb: "117,210,207",
    highlightRgb: "117,210,207",
    riskRgb: { moderate: "230,199,108", high: "244,155,83", extreme: "240,95,89" },
    sea: "#06131b",
    land: "#0b2630",
  },
  graphite: {
    accent: "#e6b84a",
    landRgb: "154,160,158",
    highlightRgb: "230,184,74",
    riskRgb: { moderate: "216,200,135", high: "238,155,81", extreme: "240,100,85" },
    sea: "#050607",
    land: "#111315",
  },
} as const;
