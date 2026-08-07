export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card p-4">
      <Skeleton className="mb-3 h-4 w-24" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="mb-2 h-10 w-full" />
      ))}
    </div>
  );
}