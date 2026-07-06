import { z } from "zod";

export const createEmployerSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .trim(),
  companyLogo: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .nullable(),
  website: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .nullable(),
  industry: z
    .string()
    .min(2, "Industry must be at least 2 characters")
    .optional()
    .nullable(),
  size: z
    .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .optional()
    .nullable(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .optional()
    .nullable(),
});

export const updateEmployerSchema = createEmployerSchema.partial();

export const employerResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyName: z.string(),
  companyLogo: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  isVerified: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
  }).optional(),
  jobs: z.array(z.any()).optional(),
});

// Types
export type CreateEmployerInput = z.infer<typeof createEmployerSchema>;
export type UpdateEmployerInput = z.infer<typeof updateEmployerSchema>;
export type EmployerResponse = z.infer<typeof employerResponseSchema>;