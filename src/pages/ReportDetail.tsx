import { useParams, Link } from 'react-router-dom';
import { useReport } from '../hooks/useReports';
import { useAuth } from '../hooks/useAuth';
import { useDeleteReport } from '../hooks/useDeleteReport';
import { Trash2, Edit3, ChevronLeft, CalendarDays, CircleDot, UserRound, Building2, Sparkles } from 'lucide-react';
import { SeverityBadge } from '../components/SeverityBadge';

export const ReportDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: report, isLoading } = useReport(slug!);
  const { data: authUser } = useAuth();
  const { mutate: deleteReport, isPending: isDeleting } = useDeleteReport();

  const isAdmin = authUser?.role === 'admin';

  const isAuthenticated = !!authUser;
  const isOwner = isAuthenticated && (report?.submitted_by?.id === authUser.id);
  const createdAt = report?.created_at;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-12">
        <div className="max-w-5xl mx-auto rounded-xl border border-border bg-card p-10 text-center text-muted-foreground font-semibold">
          Loading report details...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-12">
        <div className="max-w-5xl mx-auto rounded-xl border border-border bg-card p-10 text-center text-muted-foreground font-semibold">
          Report not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 md:py-14">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/dashboard/reports/${report.slug}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wide text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Edit3 size={14} />
                Edit
              </Link>

              <button
                onClick={() => confirm('Are you sure?') && deleteReport(report.slug)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-destructive hover:bg-destructive/15 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}

          {!isOwner && isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => confirm('Are you sure?') && deleteReport(report.slug)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-destructive hover:bg-destructive/15 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <article className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
          <header className="space-y-4 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <SeverityBadge severity={report.severity} />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <CircleDot size={12} />
                {report.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{report.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <UserRound size={14} className="text-primary" />
                <span>Submitted by {report.submitted_by.name}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <CalendarDays size={14} className="text-primary" />
                <span>{createdAt}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <Building2 size={14} className="text-primary" />
                <span>
                  Target Program: {report.program ? `${report.program.name} (${report.program.multiplier}x)` : 'Not specified'}
                </span>
              </div>
            </div>
          </header>


          {/* --- AI TRIAGE SUMMARY --- */}
          {report.ai_summary && (
            <div className="mb-10 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-center gap-2 mb-3 text-blue-700">
                <Sparkles size={18} className="animate-pulse" />
                <h3 className="font-black text-sm uppercase tracking-widest">AI Triage Summary</h3>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                {report.ai_summary}
              </p>
            </div>
          )}

          {/* --- ORIGINAL DESCRIPTION --- */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black mb-3">Description</h2>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{report.description}</p>
          </section>

          {report.evidence_image_url && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black mb-3">Evidence Image</h2>
              <div className="rounded-lg border border-border overflow-hidden">
                <img
                  src={report.evidence_image_url}
                  alt="Evidence for vulnerability report"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="p-8 text-center text-muted-foreground">Image not available</div>';
                    }
                  }}
                />
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};