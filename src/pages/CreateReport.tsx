import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema } from '../types/schemas';
import  type { ReportFormData } from '../types/schemas';
import { useCreateReport } from '../hooks/useCreateReport';

export const CreateReport = () => {
  const { mutate, isPending } = useCreateReport();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = (data: ReportFormData) => {
    mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Submit Vulnerability</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Title Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bug Title</label>
          <input
            {...register('title')}
            className={`w-full p-3 border rounded-xl outline-none transition ${errors.title ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
            placeholder="e.g., SQL Injection in Login API"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500 font-medium">{errors.title.message}</p>}
        </div>

        {/* Severity Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Severity Level</label>
          <select
            {...register('severity')}
            className={`w-full p-3 border rounded-xl bg-white outline-none transition ${errors.severity ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
          >
            <option value="">Select Severity...</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          {errors.severity && <p className="mt-1 text-xs text-red-500 font-medium">{errors.severity.message}</p>}
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Description</label>
          <textarea
            {...register('description')}
            rows={5}
            className={`w-full p-3 border rounded-xl outline-none transition ${errors.description ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
            placeholder="Explain the steps to reproduce the exploit..."
          />
          {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition disabled:opacity-50"
        >
          {isPending ? 'Uploading to Terminal...' : 'Deploy Report'}
        </button>
      </form>
    </div>
  );
};