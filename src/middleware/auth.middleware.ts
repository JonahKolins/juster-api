import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../types';

// Middleware для аутентификации
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получаем токен из cookies
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return next(AppError.unauthorized('Токен доступа отсутствует'));
    }
    
    // Верифицируем токен
    const userData = verifyAccessToken(accessToken);
    
    if (!userData) {
      return next(AppError.unauthorized('Недействительный токен доступа'));
    }
    
    // Добавляем информацию о пользователе в запрос
    (req as AuthRequest).user = userData;
    
    next();
  } catch (error) {
    next(AppError.unauthorized('Ошибка аутентификации'));
  }
};

// Middleware для проверки роли пользователя
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;
      
      if (!authReq.user) {
        return next(AppError.unauthorized('Пользователь не аутентифицирован'));
      }
      
      if (!allowedRoles.includes(authReq.user.role)) {
        return next(AppError.forbidden('У вас нет прав для выполнения этого действия'));
      }
      
      next();
    } catch (error) {
      next(AppError.forbidden('Ошибка авторизации'));
    }
  };
};

// Middleware для проверки роли администратора
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return next(AppError.unauthorized('Пользователь не аутентифицирован'));
    }
    
    if (authReq.user.role !== UserRole.ADMIN) {
      return next(AppError.forbidden('Для этого действия требуются права администратора'));
    }
    
    next();
  } catch (error) {
    next(AppError.forbidden('Ошибка авторизации'));
  }
}; 