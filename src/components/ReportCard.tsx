import { Link } from 'react-router-dom';
import type { Report } from '../types/report';
import { SeverityBadge } from './SeverityBadge';
import { ArrowUpRight, CalendarDays, CircleDot, UserRound } from 'lucide-react';

interface Props {
  report: Report;
}

export const ReportCard = ({ report }: Props) => {
  const createdAt = new Date(report.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const severityTone = {
    Low: 'from-secondary to-secondary/40',
    Medium: 'from-primary/70 to-primary/30',
    High: 'from-accent to-accent/40',
    Critical: 'from-destructive to-destructive/40',
  }[report.severity];

  return (
    <Link
      to={`/dashboard/reports/${report.slug}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-7 transition-all duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm active:translate-y-0">
        <span className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${severityTone}`} />

        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
            <CircleDot size={11} />
            ID {report.id}
          </span>
          <SeverityBadge severity={report.severity} />
        </div>

        <h3 className="mb-2 text-lg md:text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {report.title}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-foreground/80 line-clamp-3">
          {report.description}
        </p>

        <div className="mb-6 space-y-2.5">
          <div className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-foreground/75">
            <UserRound size={13} className="text-primary" />
            <span className="truncate">{report.submitted_by.name}</span>
          </div>

          <div className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-foreground/75">
            <CalendarDays size={13} className="text-primary" />
            <span>{createdAt}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-foreground/65">
            View Report
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-bold text-foreground transition-all duration-200 motion-reduce:transition-none group-hover:border-primary/50 group-hover:text-primary group-hover:translate-x-0.5">
            Open
            <ArrowUpRight size={15} />
          </span>
        </div>
      </article>
    </Link>
  );
};