interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
}

export const DashboardFilters = ({ searchTerm, onSearchChange, severity, onSeverityChange }: Props) => (
  <div className="flex flex-col md:flex-row gap-4 mb-10">
    <input
      type="text"
      placeholder="Search vulnerabilities..."
      value={searchTerm}
      className="flex-1 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => onSearchChange(e.target.value)}
    />

    <select 
      value={severity}
      className="p-3 border border-gray-200 rounded-xl bg-white outline-none cursor-pointer"
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