export interface Segment { label: string; value: number; className: string }

export function StackedBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden bg-white/15" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}>
        {segments.map((s) => <div key={s.label} className={s.className} style={{ width: `${(s.value / total) * 100}%` }} />)}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {segments.map((s) => <span key={s.label}>{s.label}: <b className="font-semibold text-foreground">{s.value}</b></span>)}
      </div>
    </div>
  );
}
