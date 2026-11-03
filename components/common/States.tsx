import { GlassCard } from "./GlassCard";

export function LoadingBlock({ lines = 3 }: { lines?: number }) {
  return (
    <GlassCard className="animate-pulse space-y-3" >
      {Array.from({ length: lines }, (_, i) => <div key={i} className="h-4 bg-white/15" />)}
    </GlassCard>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert">
      <GlassCard>
        <p className="text-sm">{message}</p>
        {onRetry && <button className="btn mt-3" onClick={onRetry}>Try again</button>}
      </GlassCard>
    </div>
  );
}
