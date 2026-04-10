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
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: string;
  created_at: string;
  submitted_by: User; // Points to the updated User interface
}