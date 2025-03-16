import { Response } from 'express';
import { ApiError } from '../types';

// Успешный ответ API
export const apiSuccess = <T>(
  res: Response,
  data: T,
  status = 200
): Response => {
  return res.status(status).json({
    success: true,
    data,
  });
};

// Ответ с ошибкой
export const apiError = (
  res: Response,
  error: ApiError | Error,
  status = 500
): Response => {
  const errorResponse = {
    success: false,
    message: error instanceof Error ? error.message : error.message,
    status: error instanceof Error ? status : error.status,
    errors: 'errors' in error ? error.errors : undefined,
  };

  return res.status(errorResponse.status).json(errorResponse);
};

// Класс для создания ошибок API
export class AppError extends Error implements ApiError {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status = 400, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string, errors?: Record<string, string[]>): AppError {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message = 'Не авторизован'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Доступ запрещен'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = 'Ресурс не найден'): AppError {
    return new AppError(message, 404);
  }

  static internal(message = 'Внутренняя ошибка сервера'): AppError {
    return new AppError(message, 500);
  }
} 