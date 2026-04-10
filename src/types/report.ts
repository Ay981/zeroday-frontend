export interface User {
  id: number;
  name: string;
  email: string;
  reputation: number; 
  level: number;     
}

export interface Report {
  id: number;
  slug: string;
  title: string;
  program_id: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: string;
  created_at: string;
  program?: Program; // The bug now belongs to a program
  submitted_by: User; // Points to the updated User interface
}
export interface Program {
  id: number;
  name: string;
  multiplier: number;
  description: string;
}

