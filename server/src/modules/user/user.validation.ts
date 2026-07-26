import { z } from "zod";
import { AuthProvider, Role } from "../../../prisma/generated/prisma/index.js";

const allowedRoles = ['USER', 'EMPLOYER'] as const;
const CreateRoleEnum = z.enum(allowedRoles);

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z
    .email({ message: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .nullable(),
  provider: z.nativeEnum(AuthProvider).optional(),
  providerId: z.string().optional().nullable(),
  role: CreateRoleEnum.default('USER'),
});

export const loginSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const userDtoSchema = z.object({
  id: z.string(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z.string(),
  role: z.nativeEnum(Role).optional(),
});

export type CreateUserModel = z.infer<typeof createUserSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
