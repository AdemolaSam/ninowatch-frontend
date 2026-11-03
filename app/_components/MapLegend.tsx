import { GlassCard } from "@/components/common/GlassCard";

export function MapLegend() {
  const item = "flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs";
  return (
    <GlassCard className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 !px-3 !py-2">
      <p className="label whitespace-nowrap">Map legend</p>
      <p className={item}><span className="h-2 w-2 bg-accent" style={{ borderRadius: "50%" }} /> Outlook area</p>
      <p className={item}><span className="h-3 w-3 border-2 border-accent" style={{ borderRadius: "50%" }} /> Reported incident</p>
      <p className="whitespace-nowrap text-xs text-muted">Other areas: no assessment</p>
    </GlassCard>
  );
}
