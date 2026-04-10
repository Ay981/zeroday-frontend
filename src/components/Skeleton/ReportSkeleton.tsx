export const ReportSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 animate-pulse">
    <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-muted/70 via-muted to-muted/70" />

    <div className="flex items-start justify-between mb-5">
      <div className="h-4 w-16 rounded-full bg-muted"></div>
      <div className="h-6 w-20 rounded-full bg-muted"></div>
    </div>

    <div className="h-6 w-3/4 rounded-lg bg-muted/80 mb-3"></div>
    <div className="space-y-2 mb-6">
      <div className="h-3 w-full rounded bg-muted/60"></div>
      <div className="h-3 w-5/6 rounded bg-muted/60"></div>
      <div className="h-3 w-2/3 rounded bg-muted/60"></div>
    </div>

    <div className="space-y-2.5 mb-6">
      <div className="h-10 w-full rounded-lg bg-muted/50"></div>
      <div className="h-10 w-full rounded-lg bg-muted/50"></div>
    </div>

    <div className="pt-4 border-t border-border flex items-center justify-between">
      <div className="h-3 w-24 rounded bg-muted/60"></div>
      <div className="h-8 w-20 rounded-md bg-muted/70"></div>
    </div>
  </div>
);