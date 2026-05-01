import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReports } from '../hooks/useReports';
import { useDebounce } from '../hooks/useDebounce';
import { ReportCard } from '../components/ReportCard';
import { DashboardFilters } from '../components/DashboardFilters';
import { Pagination } from '../components/Pagination';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom'; 
import { ReportSkeleton } from '../components/Skeleton/ReportSkeleton';
import { AlertTriangle, Bug, ShieldCheck } from 'lucide-react';
import appLogo from '../assets/image.png';

export const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. URL State Extraction
  const page = Number(searchParams.get('page')) || 1;
  const severity = searchParams.get('severity') || '';
  const urlSearch = searchParams.get('search') || '';
  const aiMode = searchParams.get('ai_mode') === 'true';

  // 2. Search Logic
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 3. Data Fetch
  const { data, isLoading, error, isPlaceholderData } = useReports(page, urlSearch, severity, aiMode);

  // 4. URL Update Helper
  const updateParams = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value.toString());
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // 5. AI Mode Toggle Helper
  const toggleAiMode = () => {
    const params = new URLSearchParams(searchParams);
    params.set('ai_mode', (!aiMode).toString());
    params.set('page', '1'); // Reset to page 1
    setSearchParams(params);
  };

  useEffect(() => {
    if (debouncedSearch !== urlSearch) updateParams('search', debouncedSearch);
  }, [debouncedSearch]);

  const reports = data?.data ?? [];
  const criticalOnPage = reports.filter((report) => report.severity === 'Critical').length;
  const openOnPage = reports.filter((report) => report.status.toLowerCase().includes('open')).length;

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground px-6 py-10">
        <div className="max-w-6xl mx-auto rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center font-bold text-destructive shadow-sm">
          API Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-6">
      <Navbar />

      <div className="mt-8 mb-6 md:mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black mb-2">Threat Intelligence</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center overflow-hidden">
              <img src={appLogo} alt="ZeroDay logo" className="h-8 w-8 md:h-9 md:w-9 object-contain scale-[1.7]" />
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">ZeroDay Feed</h1>
          </div>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex h-11 items-center justify-center px-5 rounded-lg font-bold text-primary-foreground bg-primary hover:opacity-90 transition-all duration-200 motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background text-center whitespace-nowrap"
        >
          + Submit Vulnerability
        </Link>
      </div>

      {!isLoading && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-black mb-1">Total Results</p>
            <p className="text-2xl font-black text-foreground inline-flex items-center gap-2">
              <Bug size={18} className="text-primary" />
              {data?.meta.total ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-destructive/40">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-black mb-1">Critical (This Page)</p>
            <p className="text-2xl font-black text-destructive inline-flex items-center gap-2">
              <AlertTriangle size={18} />
              {criticalOnPage}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-black mb-1">Open Status</p>
            <p className="text-2xl font-black text-foreground inline-flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              {openOnPage}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 md:p-5 mb-8">
        <DashboardFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          severity={severity}
          onSeverityChange={(val) => updateParams('severity', val)}
          aiMode={aiMode}
          onAiModeToggle={toggleAiMode}
        />
      </div>

        {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <ReportSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.length === 0 ? (
              <p className="col-span-full text-center py-10 text-muted-foreground font-bold">No results found.</p>
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
    </div>
  );
};