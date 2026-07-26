import { z } from "zod";

// Job Type enum values
const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]);

// Experience Level enum values
const ExperienceLevelEnum = z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"]);

// Work Mode enum values
const WorkModeEnum = z.enum(["REMOTE", "ONSITE", "HYBRID"]);

// Currency enum
const CurrencyEnum = z.enum(["USD", "BDT", "EUR", "GBP", "SGD", "AUD", "CAD", "INR"]);

// Shared field definitions
const jobFields = {
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters")
    .trim(),
  
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must be less than 100 characters")
    .trim(),
  
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .trim(),
  
  type: JobTypeEnum,
  
  experience: ExperienceLevelEnum.optional().nullable(),
  
  workMode: WorkModeEnum.optional().nullable(),
  
  officeTime: z
    .string()
    .min(1, "Office time is required")
    .max(50, "Office time must be less than 50 characters")
    .trim(),
  
  salary: z
    .number()
    .positive("Salary must be a positive number")
    .optional()
    .nullable(),
  
  salaryMax: z
    .number()
    .positive("Maximum salary must be a positive number")
    .optional()
    .nullable(),
  
  currency: CurrencyEnum.default("USD"),
  
  deadline: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .nullable(),
  
  skills: z
    .array(z.string().min(1, "Skill cannot be empty").trim())
    .min(1, "At least one skill is required")
    .max(20, "Maximum 20 skills allowed"),
};


export const createJobSchema = z
  .object(jobFields)
  .refine(
    (data) => {
      if (data.salary && data.salaryMax && data.salaryMax < data.salary) {
        return false;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    }
  )
  .refine(
    (data) => {
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline);
        const now = new Date();
        return deadlineDate > now;
      }
      return true;
    },
    {
      message: "Deadline must be in the future",
      path: ["deadline"],
    }
  );

export const updateJobSchema = z.object({
  title: jobFields.title.optional(),
  description: jobFields.description.optional(),
  position: jobFields.position.optional(),
  location: jobFields.location.optional(),
  type: jobFields.type.optional(),
  experience: jobFields.experience,
  workMode: jobFields.workMode,
  officeTime: jobFields.officeTime.optional(),
  salary: jobFields.salary,
  salaryMax: jobFields.salaryMax,
  currency: jobFields.currency.optional(),
  deadline: jobFields.deadline,
  skills: jobFields.skills.optional(),
});


export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;