import { useParams } from 'react-router-dom';
import { useReport } from '../hooks/useReports';
import { useUpdateReport } from '../hooks/useUpdateReport';
import { ReportForm } from '../components/ReportForm';

export const EditReport = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // 1. Fetch current data to fill the form
  const { data: report, isLoading: isFetching } = useReport(slug!);
  
  // 2. Setup the update mutation
  const { mutate, isPending: isUpdating } = useUpdateReport(slug!);

  if (isFetching) {
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
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 md:py-14">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black">Maintenance</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Edit Vulnerability</h1>
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