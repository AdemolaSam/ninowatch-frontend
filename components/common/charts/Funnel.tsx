export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const first = steps[0].value;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s.label}>
          <div className="flex justify-between text-sm"><span>{s.label}</span><b className="font-semibold">{s.value.toLocaleString("en")}</b></div>
          <div className="mt-1 h-2 bg-white/15"><div className="h-2 bg-accent" style={{ width: `${(s.value / first) * 100}%`, opacity: 1 - i * 0.18 }} /></div>
          {i > 0 && <p className="mt-0.5 text-xs text-muted">{Math.round((s.value / steps[i - 1].value) * 100)}% of the step before</p>}
        </div>
      ))}
    </div>
  );
}
