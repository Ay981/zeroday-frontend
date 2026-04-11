import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReportFormData } from '../types/schemas';
import { reportSchema } from '../types/schemas';
import { usePrograms } from '../hooks/usePrograms';

import type { Report } from '../types/report';

interface Props {
  initialData?: Report; // Optional: if provided, we are in "Edit" mode
  onSubmit: (data: ReportFormData) => void;
  isLoading: boolean;
  buttonText: string;
}

export const ReportForm = ({ initialData, onSubmit, isLoading, buttonText }: Props) => {
  const { data: programs, isLoading: loadingPrograms } = usePrograms();

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      severity: initialData.severity,
      description: initialData.description,
      program_id: initialData.program ? String(initialData.program.id) : '',
    } : {},
  });

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-border bg-card p-5 md:p-7">
      {isSubmitted && hasErrors && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
          Please fix the highlighted fields before submitting.
        </div>
      )}

      <div>
        <label className="mb-1.5 ml-1 block text-xs font-black uppercase tracking-[0.14em] text-foreground/80">Bug Title</label>
        <input
          {...register('title')}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.title ? 'border-destructive/60 bg-destructive/5 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        />
        {errors.title && <p className="mt-1 text-xs font-semibold text-destructive">{errors.title.message}</p>}
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
        <label className="mb-1.5 ml-1 block text-xs font-black uppercase tracking-[0.14em] text-foreground/80">Severity</label>
        <select
          {...register('severity')}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.severity ? 'border-destructive/60 bg-destructive/5 focus-visible:ring-destructive/50' : 'border-primary/40 hover:border-primary'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        >
          <option value="">Select Severity...</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        {errors.severity && <p className="mt-1 text-xs font-semibold text-destructive">{errors.severity.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 ml-1 block text-xs font-black uppercase tracking-[0.14em] text-foreground/80">Target Program</label>
        <select
          {...register('program_id')}
          disabled={loadingPrograms}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.program_id ? 'border-destructive/60 bg-destructive/5 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <option value="">{loadingPrograms ? 'Loading programs...' : 'Select a company...'}</option>
          {programs?.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name} ({program.multiplier}x Multiplier)
            </option>
          ))}
        </select>
        {errors.program_id && <p className="mt-1 text-xs font-semibold text-destructive">{errors.program_id.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 ml-1 block text-xs font-black uppercase tracking-[0.14em] text-foreground/80">Description</label>
        <textarea
          {...register('description')}
          rows={5}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.description ? 'border-destructive/60 bg-destructive/5 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        />
        {errors.description && <p className="mt-1 text-xs font-semibold text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-3.5 font-black tracking-wide text-primary-foreground transition-all duration-200 motion-reduce:transition-none hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isLoading ? 'Processing...' : buttonText}
        </button>
        {isLoading && (
          <p className="text-center text-xs font-semibold text-primary">
            Validating and submitting your report...
          </p>
        )}
      </div>
    </form>
  );
};