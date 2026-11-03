export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const max = Math.max(...values), min = Math.min(...values), span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / span) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-12 w-full" role="img" aria-label={label}>
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
