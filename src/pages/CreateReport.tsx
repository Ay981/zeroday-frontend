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
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 md:py-14">
      <div className="max-w-3xl mx-auto space-y-6">
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