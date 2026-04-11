import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { ReportFormData } from '../types/schemas';
import { useCreateReport } from '../hooks/useCreateReport';
import { ReportForm } from '../components/ReportForm';
import appLogo from '../assets/image.png';

export const CreateReport = () => {
  const { mutate, isPending } = useCreateReport();

  const onSubmit = (data: ReportFormData) => {
    mutate(data);
  };

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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black">Submission</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden">
              <img src={appLogo} alt="ZeroDay logo" className="h-8 w-8 object-contain scale-[1.7]" />
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Submit Vulnerability</h1>
          </div>
          <p className="text-sm text-muted-foreground">Provide a clear, reproducible report to help triage and remediation.</p>
        </header>

        <ReportForm onSubmit={onSubmit} isLoading={isPending} buttonText="Deploy Report" />
      </div>
    </div>
  );
};