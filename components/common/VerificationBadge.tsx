import { Check, CheckCheck, CircleHelp } from "lucide-react";
import type { Verification } from "@/lib/types";

const styles = {
  confirmed: { label: "Confirmed", cls: "bg-accent text-accent-fg", Icon: Check },
  corroborated: { label: "Corroborated", cls: "border-[1.5px] border-accent text-accent", Icon: CheckCheck },
  unverified: { label: "Unverified", cls: "border-[1.5px] border-dashed border-white/50 text-muted", Icon: CircleHelp },
} as const;

// Status is always icon plus text, never color alone.
export function VerificationBadge({ status }: { status: Verification }) {
  const { label, cls, Icon } = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon size={12} aria-hidden /> {label}
    </span>
  );
}
