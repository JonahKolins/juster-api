import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
  password?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionResponse {
  id: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Расширение типа Express Request для включения пользовательских данных
export interface AuthRequest extends Request {
  user?: UserPayload;
} 