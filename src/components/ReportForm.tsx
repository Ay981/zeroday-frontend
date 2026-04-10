import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReportFormData } from '../types/schemas';
import { reportSchema } from '../types/schemas';

import type { Report } from '../types/report';

interface Props {
  initialData?: Report; // Optional: if provided, we are in "Edit" mode
  onSubmit: (data: ReportFormData) => void;
  isLoading: boolean;
  buttonText: string;
}

export const ReportForm = ({ initialData, onSubmit, isLoading, buttonText }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      severity: initialData.severity,
      description: initialData.description,
    } : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div>
        <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Bug Title</label>
        <input
          {...register('title')}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.title ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        />
        {errors.title && <p className="mt-1 text-xs font-semibold text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Severity</label>
        <select
          {...register('severity')}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.severity ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
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
        <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Description</label>
        <textarea
          {...register('description')}
          rows={6}
          className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.description ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        />
        {errors.description && <p className="mt-1 text-xs font-semibold text-destructive">{errors.description.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-3.5 font-bold text-primary-foreground transition-all duration-200 motion-reduce:transition-none hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
};