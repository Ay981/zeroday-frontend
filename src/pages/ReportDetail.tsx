import { useParams, Link } from 'react-router-dom';
import { useReport } from '../hooks/useReports';
import { useAuth } from '../hooks/useAuth'; // Our identity hook
import { useDeleteReport } from '../hooks/useDeleteReport';
import { Trash2, Edit3, ChevronLeft } from 'lucide-react';

export const ReportDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: report, isLoading } = useReport(slug!);
  const { data: authUser } = useAuth(); // Get current hacker
  const { mutate: deleteReport, isPending: isDeleting } = useDeleteReport();

  // THE OWNERSHIP CHECK (Client-side Authorization)
  const isOwner = authUser?.id === report?.submitted_by.id;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!report) return <div className="p-10 text-center">Report not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-black transition">
          <ChevronLeft size={20} /> <span className="font-bold text-sm">Back</span>
        </Link>

        {/* --- Action Buttons (Only for the Owner) --- */}
        {isOwner && (
          <div className="flex space-x-3 ">
          <Link 
            to={`/dashboard/reports/${report.slug}/edit`}
            className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition w-fit flex items-center space-x-1"
          >
            <Edit3 size={16} /> <span>Edit</span>
          </Link>
            
            <button 
              onClick={() => confirm('Are you sure?') && deleteReport(report.slug)}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition disabled:opacity-50"
            >
              <Trash2 size={16} /> <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
        <h1 className="text-4xl font-black mb-4">{report.title}</h1>
        <p className="text-gray-600 leading-relaxed">{report.description}</p>
      </div>
    </div>
  );
};