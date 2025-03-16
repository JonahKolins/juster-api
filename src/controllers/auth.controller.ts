import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import config from '../config/config';
import authService from '../services/auth.service';
import { apiSuccess, AppError } from '../utils/api-response';
import { AuthRequest } from '../types';

/**
 * Класс контроллера для аутентификации
 */
class AuthController {
  /**
   * Регистрация нового пользователя
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация запроса
      await this.validateRegister(req, res);
      
      // Регистрация пользователя
      const newUser = await authService.register(req.body);
      
      // Возвращаем результат
      return apiSuccess(res, { user: newUser }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Аутентификация пользователя
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация запроса
      await this.validateLogin(req, res);
      
      // Аутентификация пользователя
      const { user, accessToken, refreshToken } = await authService.login(req.body, req);
      
      // Устанавливаем cookies
      this.setTokenCookies(res, accessToken, refreshToken);
      
      // Возвращаем данные пользователя
      return apiSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Выход из системы
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Получаем refreshToken из cookies
      const refreshToken = req.cookies.refreshToken;
      
      if (refreshToken) {
        // Удаляем сессию
        await authService.logout(refreshToken);
      }
      
      // Очищаем cookies
      this.clearTokenCookies(res);
      
      return apiSuccess(res, { message: 'Выход выполнен успешно' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление токенов
   */
  async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      // Получаем refresh токен из cookies
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return next(AppError.unauthorized('Refresh токен отсутствует'));
      }
      
      // Обновляем токены
      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);
      
      // Устанавливаем новые cookies
      this.setTokenCookies(res, accessToken, newRefreshToken);
      
      return apiSuccess(res, { message: 'Токены успешно обновлены' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение информации о текущей сессии
   */
  async getCurrentSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return apiSuccess(res, { authenticated: false });
      }
      
      return apiSuccess(res, {
        authenticated: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Валидация данных для регистрации
   */
  private async validateRegister(req: Request, res: Response) {
    // Определяем правила валидации
    await Promise.all([
      body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .run(req),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Пароль должен содержать не менее 6 символов')
        .run(req),
      body('name')
        .notEmpty()
        .withMessage('Имя пользователя обязательно')
        .run(req),
    ]);

    // Проверяем результаты валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ошибка валидации', 
        errors: errors.array() 
      });
    }
  }

  /**
   * Валидация данных для входа
   */
  private async validateLogin(req: Request, res: Response) {
    // Определяем правила валидации
    await Promise.all([
      body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .run(req),
      body('password')
        .notEmpty()
        .withMessage('Введите пароль')
        .run(req),
    ]);

    // Проверяем результаты валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ошибка валидации', 
        errors: errors.array() 
      });
    }
  }

  /**
   * Установка JWT токенов в cookies
   */
  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    // Настройки для cookie
    const cookieOptions = {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    };
    
    // Устанавливаем cookies
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 минут в миллисекундах
    });
    
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в миллисекундах
    });
  }

  /**
   * Очистка JWT токенов из cookies
   */
  private clearTokenCookies(res: Response) {
    const cookieOptions = {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    };
    
    res.cookie('accessToken', '', {
      ...cookieOptions,
      maxAge: 0,
    });
    
    res.cookie('refreshToken', '', {
      ...cookieOptions,
      maxAge: 0,
    });
  }
}

export default new AuthController(); 