import { z } from 'zod';

// Zod schema for user validation
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// TypeScript type derived from Zod schema
export type User = z.infer<typeof UserSchema>;

// Form data type (without id and timestamps)
export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

// API error type
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}