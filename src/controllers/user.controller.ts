import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import userService from '../services/user.service';
import authService from '../services/auth.service';
import { apiSuccess } from '../utils/api-response';

/**
 * Класс контроллера для работы с пользователями
 */
class UserController {
  /**
   * Получение профиля текущего пользователя
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Пользователь не аутентифицирован' });
      }

      const userProfile = await userService.getUserById(req.user.id);
      return apiSuccess(res, { user: userProfile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение сессий текущего пользователя
   */
  async getUserSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Пользователь не аутентифицирован' });
      }

      const sessions = await authService.getUserSessions(req.user.id);
      return apiSuccess(res, { sessions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление профиля текущего пользователя
   */
  async updateProfile(req: AuthRequest & Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Пользователь не аутентифицирован' });
      }

      // Не позволяем менять роль через этот эндпоинт
      const { role, ...updateData } = req.body;

      const updatedUser = await userService.updateUser(req.user.id, updateData);
      return apiSuccess(res, { user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение списка всех пользователей (для администратора)
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return apiSuccess(res, { users });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение пользователя по ID (для администратора)
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUserById(userId);
      return apiSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Создание нового пользователя (для администратора)
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await userService.createByAdmin(req.body);
      return apiSuccess(res, { user: newUser }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление пользователя по ID (для администратора)
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const updatedUser = await userService.updateUser(userId, req.body);
      return apiSuccess(res, { user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Удаление пользователя по ID (для администратора)
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      await userService.deleteUser(userId);
      return apiSuccess(res, { message: 'Пользователь успешно удален' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение сессий пользователя по ID (для администратора)
   */
  async getUserSessionsById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const sessions = await authService.getUserSessions(userId);
      return apiSuccess(res, { sessions });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController(); 