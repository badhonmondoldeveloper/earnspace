import { z } from 'zod';
import { RESERVED_USERNAMES, normalizeUsername, normalizeEmail, normalizeLoginIdentifier } from '@/lib/auth';

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(60),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
    .refine((val) => !RESERVED_USERNAMES.includes(val.toLowerCase()), {
      message: 'This username is reserved by the system',
    }),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  emailOrUsername: z.string().trim().toLowerCase().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(60),
  bio: z.string().max(250).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().or(z.literal('')).optional(),
  socialLinks: z.record(z.string()).optional(),
});

