import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  email: z.email({ message: 'Please provide a valid email address' })  
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address' })
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required')
});