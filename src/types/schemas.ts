import { z } from 'zod';

const severityOptions = ['Low', 'Medium', 'High', 'Critical'] as const;

export const reportSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  severity: z.enum(severityOptions, {
    message: "Please select a valid severity level",
  }),
  description: z.string().min(20, "Please provide a more detailed description"),
});

// Extract the TypeScript type from the schema
export type ReportFormData = z.infer<typeof reportSchema>;