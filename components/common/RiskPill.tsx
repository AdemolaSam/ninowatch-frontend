import type { Risk } from "@/lib/types";

const cls: Record<Risk, string> = { moderate: "bg-risk-moderate", high: "bg-risk-high", extreme: "bg-risk-extreme" };

export function RiskPill({ risk }: { risk: Risk }) {
  return <span className={` px-2.5 py-0.5 text-xs font-semibold text-accent-fg ${cls[risk]}`}>{risk[0].toUpperCase() + risk.slice(1)} risk</span>;
}
