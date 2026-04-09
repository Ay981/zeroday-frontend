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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Bug Title</label>
        <input
          {...register('title')}
          className={`w-full p-3 border rounded-xl outline-none ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Severity</label>
        <select {...register('severity')} className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
        <textarea {...register('description')} rows={5} className="w-full p-3 border border-gray-200 rounded-xl outline-none" />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
};