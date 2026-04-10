import type { Report } from '../types/report';
import { CircleDot } from 'lucide-react';

interface Props {
  severity: Report['severity']; // Uses the type from our Interface
}

export const SeverityBadge = ({ severity }: Props) => {
  const themes = {
    Low: 'border-border bg-secondary text-secondary-foreground',
    Medium: 'border-primary/40 bg-primary/10 text-primary',
    High: 'border-accent bg-accent/20 text-accent-foreground',
    Critical: 'border-destructive/50 bg-destructive/15 text-destructive animate-pulse',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.14em] ${themes[severity]}`}>
      <CircleDot size={10} />
      {severity}
    </span>
  );
};