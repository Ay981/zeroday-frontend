export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Report {
  id: number;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: string;
  created_at: string;
  submitted_by: { // Match the JSON exactly
    id: number;
    name: string;
  };
}