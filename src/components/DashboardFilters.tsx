import { Sparkles } from 'lucide-react';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  aiMode: boolean;
  onAiModeToggle: () => void;
}

export const DashboardFilters = ({ searchTerm, onSearchChange, severity, onSeverityChange, aiMode, onAiModeToggle }: Props) => (
  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full">
    <div className="flex-1 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
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

    <div className="flex items-center gap-2">
      <button
        onClick={onAiModeToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
          aiMode 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-400' 
          : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
        }`}
      >
        <Sparkles size={14} className={aiMode ? 'animate-pulse' : ''} />
        {aiMode ? 'AI Semantic Search' : 'Keyword Search'}
      </button>
    </div>
  </div>
);