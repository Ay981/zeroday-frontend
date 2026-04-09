interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
}

export const DashboardFilters = ({ searchTerm, onSearchChange, severity, onSeverityChange }: Props) => (
  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full">
    <input
      type="text"
      placeholder="Search vulnerabilities..."
      value={searchTerm}
      className="flex-1 h-12 px-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => onSearchChange(e.target.value)}
    />

    <select 
      value={severity}
      className="h-12 px-4 border border-gray-200 rounded-xl bg-white outline-none cursor-pointer min-w-[170px]"
      onChange={(e) => onSeverityChange(e.target.value)}
    >
      <option value="">All Severities</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
      <option value="Critical">Critical</option>
    </select>
  </div>
);