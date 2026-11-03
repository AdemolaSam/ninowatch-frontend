import type { Theme } from "./theme";

export type Stop = [number, string];
export interface Scale { min: number; max: number; stops: Stop[] }

// Diverging: cooler than average, neutral at 0, hotter than average. Values are degrees C versus the previous-years average.
export const SCALES: Record<Theme, { anomaly: Scale; temp: Scale }> = {
  ember: {
    anomaly: { min: -1, max: 4, stops: [[0, "#5b8db8"], [0.2, "#1b1410"], [0.45, "#e8a864"], [0.72, "#ff7a3c"], [1, "#ff3b3b"]] },
    temp: { min: 20, max: 45, stops: [[0, "#1d2b3a"], [0.35, "#f2d16b"], [0.7, "#ff7a3c"], [1, "#c4202c"]] },
  },
  ocean: {
    anomaly: { min: -1, max: 4, stops: [[0, "#4a92b9"], [0.2, "#102c34"], [0.45, "#e6c76c"], [0.72, "#f49b53"], [1, "#f05f59"]] },
    temp: { min: 20, max: 45, stops: [[0, "#1b5264"], [0.35, "#e6c76c"], [0.7, "#f49b53"], [1, "#f05f59"]] },
  },
  graphite: {
    anomaly: { min: -1, max: 4, stops: [[0, "#66888f"], [0.2, "#111315"], [0.45, "#d8c887"], [0.72, "#ee9b51"], [1, "#f06455"]] },
    temp: { min: 20, max: 45, stops: [[0, "#344d51"], [0.35, "#d8c887"], [0.7, "#ee9b51"], [1, "#f06455"]] },
  },
};

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

export function scaleColor(scale: Scale, v: number): string {
  const t = Math.min(1, Math.max(0, (v - scale.min) / (scale.max - scale.min)));
  for (let i = 1; i < scale.stops.length; i++) {
    const [t1, c1] = scale.stops[i];
    const [t0, c0] = scale.stops[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0), a = hex(c0), b = hex(c1);
      return `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * k)).join(",")})`;
    }
  }
  return scale.stops[scale.stops.length - 1][1];
}

export const gradientCss = (scale: Scale) => `linear-gradient(to right, ${scale.stops.map(([t, c]) => `${c} ${t * 100}%`).join(", ")})`;
