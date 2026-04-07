import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReports } from '../hooks/useReports';
import { useDebounce } from '../hooks/useDebounce';
import { ReportCard } from '../components/ReportCard';
import { DashboardFilters } from '../components/DashboardFilters';
import { Pagination } from '../components/Pagination';

export const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. URL State Extraction
  const page = Number(searchParams.get('page')) || 1;
  const severity = searchParams.get('severity') || '';
  const urlSearch = searchParams.get('search') || '';

  // 2. Search Logic
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 3. Data Fetch
  const { data, isLoading, error, isPlaceholderData } = useReports(page, urlSearch, severity);

  // 4. URL Update Helper
  const updateParams = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value.toString());
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  useEffect(() => {
    if (debouncedSearch !== urlSearch) updateParams('search', debouncedSearch);
  }, [debouncedSearch]);

  if (error) return <div className="p-8 text-red-500 text-center font-bold">API Error: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-black text-gray-900 mb-6">ZeroDay Feed</h1>
      
      <DashboardFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        severity={severity}
        onSeverityChange={(val) => updateParams('severity', val)}
      />

      {isLoading ? (
        <div className="text-center py-20 font-bold">Synchronizing...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.length === 0 ? (
               <p className="col-span-full text-center py-10 text-gray-500 font-bold">No results found.</p>
            ) : (
              data?.data.map((report) => <ReportCard key={report.id} report={report} />)
            )}
          </div>

          <Pagination 
            currentPage={page}
            lastPage={data?.meta.last_page || 1}
            onPageChange={(p) => updateParams('page', p)}
            isLoading={isPlaceholderData}
          />
        </>
      )}
    </div>
  );
};