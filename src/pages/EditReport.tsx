import { Navigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useReport } from '../hooks/useReports';
import { useAuth } from '../hooks/useAuth';
import { useUpdateReport } from '../hooks/useUpdateReport';
import { ReportForm } from '../components/ReportForm';
import appLogo from '../assets/image.png';

export const EditReport = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: authUser, isLoading: isAuthLoading } = useAuth();
  
  // 1. Fetch current data to fill the form
  const { data: report, isLoading: isFetching } = useReport(slug!);
  
  // 2. Setup the update mutation
  const { mutate, isPending: isUpdating } = useUpdateReport(slug!);
  
  if (!(authUser?.id === report.submitted_by.id)) {
    return <Navigate to={`/dashboard/reports/${report.slug}`} replace />;
  }


  if (isFetching || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card p-10 text-center font-semibold text-muted-foreground">
          Loading report data...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card p-10 text-center font-semibold text-muted-foreground">
          Report not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-5">
        <Link
          to="/dashboard"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black">Maintenance</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden">
              <img src={appLogo} alt="ZeroDay logo" className="h-8 w-8 object-contain scale-[1.7]" />
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Edit Vulnerability</h1>
          </div>
          <p className="text-sm text-muted-foreground">Update the report details and keep the timeline accurate.</p>
        </header>

        <ReportForm
          initialData={report}
          onSubmit={(data) => mutate(data)}
          isLoading={isUpdating}
          buttonText="Update Report"
        />
      </div>
    </div>
  );
};