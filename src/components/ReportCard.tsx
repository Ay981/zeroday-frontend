import type { Report } from '../types/report';
import { SeverityBadge } from './SeverityBadge'; // Ensure you created this!

interface Props {
  report: Report;
}

export const ReportCard = ({ report }: Props) => {
  return (
    <div className="group bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            ID: #{report.id}
          </span>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {report.title}
          </h3>
        </div>
        <SeverityBadge severity={report.severity} />
      </div>

      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
        {report.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">
            {report.submitted_by.name.charAt(0)}
          </div>
          <span className="text-xs font-medium text-gray-700">
            {report.submitted_by.name}
          </span>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">
          {new Date(report.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};