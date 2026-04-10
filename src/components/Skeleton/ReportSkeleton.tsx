export const ReportSkeleton = () => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-3"></div>
    <div className="space-y-2 mb-6">
      <div className="h-3 w-full bg-gray-100 rounded"></div>
      <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
    </div>
    <div className="pt-4 border-t border-gray-50 flex justify-between">
      <div className="h-3 w-24 bg-gray-100 rounded"></div>
      <div className="h-3 w-16 bg-gray-100 rounded"></div>
    </div>
  </div>
);