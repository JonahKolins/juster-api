import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/user/profile
 * @desc Получение профиля текущего пользователя
 * @access Private
 */
router.get('/profile', authenticate, userController.getProfile.bind(userController));

/**
 * @route PUT /api/user/profile
 * @desc Обновление профиля текущего пользователя
 * @access Private
 */
router.put('/profile', authenticate, userController.updateProfile.bind(userController));

/**
 * @route GET /api/user/sessions
 * @desc Получение сессий текущего пользователя
 * @access Private
 */
router.get('/sessions', authenticate, userController.getUserSessions.bind(userController));

export default router; 