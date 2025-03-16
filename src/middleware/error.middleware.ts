import { Request, Response, NextFunction } from 'express';
import { apiError } from '../utils/api-response';
import config from '../config/config';

// Middleware для обработки ошибок 404 (не найдено)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  apiError(res, {
    message: `Маршрут ${req.originalUrl} не найден`,
    status: 404
  }, 404);
};

// Middleware для обработки всех ошибок
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Логируем ошибку только в режиме разработки
  if (config.server.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  // Если ошибка уже имеет статус, используем ее
  const statusCode = err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';
  const errors = err.errors;

  apiError(res, {
    message,
    status: statusCode,
    errors
  }, statusCode);
}; 