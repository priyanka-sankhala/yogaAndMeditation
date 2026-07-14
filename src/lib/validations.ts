import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Profile schemas
export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  bio: z.string().optional(),
  fitnesslevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
});

export const uploadProfilePhotoSchema = z.object({
  file: z.instanceof(File),
});

// Subscription schemas
export const createSubscriptionSchema = z.object({
  planId: z.string().min(1),
  duration: z.enum(['MONTHLY', 'HALF_YEARLY', 'YEARLY']),
});

export const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
});

// Content schemas
export const rateContentSchema = z.object({
  score: z.number().min(1).max(5),
  review: z.string().optional(),
});
