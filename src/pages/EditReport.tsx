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

  if (isFetching) return <div className="p-10 text-center font-bold">Loading Report Data...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Edit Vulnerability</h1>
      
      <ReportForm 
        initialData={report} 
        onSubmit={(data) => mutate(data)} 
        isLoading={isUpdating}
        buttonText="Update Report"
      />
    </div>
  );
};