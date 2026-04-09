import { Link } from 'react-router-dom';
import type { Report } from '../types/report';
import { SeverityBadge } from './SeverityBadge';

interface Props {
  report: Report;
}

export const ReportCard = ({ report }: Props) => {
  return (
    // Wrap the whole card in a Link using the SLUG
    
    <Link 
      to={`/dashboard/reports/${report.slug}`} 
      className="block group"
    >
      
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer h-full">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            ID: {report.id}
          </span>
          <SeverityBadge severity={report.severity} />
        </div>

        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {report.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {report.description}
        </p>

        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase">
          <span>{report.submitted_by.name}</span>
          <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
            View Report →
          </span>
        </div>
      </div>
    </Link>
  );
};