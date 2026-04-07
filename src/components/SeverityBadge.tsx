import type { Report } from '../types/report';

interface Props {
  severity: Report['severity']; // Uses the type from our Interface
}

export const SeverityBadge = ({ severity }: Props) => {
  // Mapping logic - easy to change colors in one place
  const themes = {
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Critical: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
  };

  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${themes[severity]}`}>
      {severity}
    </span>
  );
};