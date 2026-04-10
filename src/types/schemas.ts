import { z } from 'zod';

const severityOptions = ['Low', 'Medium', 'High', 'Critical'] as const;

export const reportSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  severity: z.enum(severityOptions, {
    message: "Please select a valid severity level",
  }),
  description: z.string().min(20, "Please provide a more detailed description"),
});
export type ReportFormData = z.infer<typeof reportSchema>;


export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
// Extract the TypeScript type from the schema
