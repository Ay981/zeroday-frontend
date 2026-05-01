export interface User {
  id: number;
  name: string;
  email: string;
  reputation: number; 
  level: number;     
  role:'researcher' | 'admin';
  is_verified?: boolean;
}

export interface Report {
  id: number;
  slug: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  ai_summary: string | null; // AI Summary
  similarity?: string;    
  evidence_image_url?: string;    // E.g., "94.5%"
  status: string;
  created_at: string;
  submitted_by: User;
  program: Program;
}
export interface Program {
  id: number;
  name: string;
  multiplier: number;
  description: string;
}

