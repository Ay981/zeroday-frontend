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
      className="flex-1 h-11 px-4 border border-border bg-background text-foreground rounded-lg outline-none transition-all duration-200 motion-reduce:transition-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
      onChange={(e) => onSearchChange(e.target.value)}
    />

    <select 
      value={severity}
      className="h-11 px-4 border border-border bg-background text-foreground rounded-lg outline-none cursor-pointer min-w-[170px] transition-all duration-200 motion-reduce:transition-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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