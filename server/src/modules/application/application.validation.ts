import { z } from "zod";
import { AppStatus } from "../../../prisma/generated/prisma/index.js";

const strictUrlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;

// Validation schema for applying to a job
export const applyJobSchema = z.object({
  jobId: z.string()
    .min(1, { message: "Job ID is required" })
    .cuid({ message: "Invalid job ID format" }),
  
  resumeUrl: z.string()
    .regex(strictUrlRegex, { message: "Invalid resume URL format (must be a valid URL with domain extension, e.g. https://example.com/resume)" })
    .min(1, { message: "Resume URL is required" })
    .max(500, { message: "Resume URL must be less than 500 characters" }),
  
  coverLetter: z.string()
    .max(5000, { message: "Cover letter must be less than 5000 characters" })
    .optional()
    .nullable(),

  phoneNumber: z.string()
    .max(50, { message: "Phone number must be less than 50 characters" })
    .optional()
    .nullable(),

  linkedinUrl: z.string()
    .regex(strictUrlRegex, { message: "Invalid LinkedIn URL format (must be a valid URL with domain extension, e.g. https://linkedin.com/in/username)" })
    .max(500, { message: "LinkedIn URL must be less than 500 characters" })
    .or(z.literal(""))
    .optional()
    .nullable(),

  portfolioUrl: z.string()
    .regex(strictUrlRegex, { message: "Invalid Portfolio URL format (must be a valid URL with domain extension, e.g. https://myportfolio.com)" })
    .max(500, { message: "Portfolio URL must be less than 500 characters" })
    .or(z.literal(""))
    .optional()
    .nullable(),

  yearsOfExp: z.union([
    z.number(),
    z.string().transform(val => val === "" ? null : Number(val))
  ])
    .pipe(z.number().int().min(0, { message: "Years of experience must be at least 0" }).nullable())
    .optional()
    .nullable()
});

// Schema for query parameters (filtering, pagination, sorting)
export const applicationQuerySchema = z.object({
  status: z.enum(Object.values(AppStatus) as [string, ...string[]])
    .optional()
    .nullable(),
  
  page: z.string()
    .regex(/^\d+$/, { message: "Page must be a number" })
    .transform(Number)
    .pipe(z.number().int().min(1, { message: "Page must be at least 1" }))
    .default(1)
    .optional(),
  
  limit: z.string()
    .regex(/^\d+$/, { message: "Limit must be a number" })
    .transform(Number)
    .pipe(z.number().int().min(1, { message: "Limit must be at least 1" }).max(100, { message: "Limit must be at most 100" }))
    .default(10) 
    .optional(),
  
  sortBy: z.enum(["appliedAt", "status", "updatedAt"] as [string, ...string[]])
    .default("appliedAt")
    .optional(),
  
  sortOrder: z.enum(["asc", "desc"] as [string, ...string[]])
    .default("desc")
    .optional()
});

// Schema for params validation
export const applicationParamsSchema = z.object({
  jobId: z.string()
    .min(1, { message: "Job ID is required" })
    .cuid({ message: "Invalid job ID format" })
});

// Schema for updating application status
export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"]),
  reviewNote: z.string().max(1000).optional(),
});

// Alternative approach: Handle defaults at the end
export const applicationQuerySchemaAlt = z.object({
  status: z.enum(Object.values(AppStatus) as [string, ...string[]])
    .optional()
    .nullable(),
  
  page: z.coerce.number()
    .int()
    .min(1, { message: "Page must be at least 1" })
    .default(1)
    .optional(),
  
  limit: z.coerce.number()
    .int()
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit must be at most 100" })
    .default(10)
    .optional(),
  
  sortBy: z.enum(["appliedAt", "status", "updatedAt"] as [string, ...string[]])
    .default("appliedAt")
    .optional(),
  
  sortOrder: z.enum(["asc", "desc"] as [string, ...string[]])
    .default("desc")
    .optional()
});

// Type inferences for TypeScript
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>;
export type ApplicationParamsInput = z.infer<typeof applicationParamsSchema>;

export default {
  applyJob: applyJobSchema,
  query: applicationQuerySchema,
  params: applicationParamsSchema
};