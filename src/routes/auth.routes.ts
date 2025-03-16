import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Регистрация нового пользователя
 * @access Public
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route POST /api/auth/login
 * @desc Аутентификация пользователя
 * @access Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route POST /api/auth/logout
 * @desc Выход из системы
 * @access Private
 */
router.post('/logout', authenticate, authController.logout.bind(authController));

/**
 * @route POST /api/auth/refresh
 * @desc Обновление токенов
 * @access Public (требуется refresh токен)
 */
router.post('/refresh', authController.refreshTokens.bind(authController));

/**
 * @route GET /api/auth/session
 * @desc Получение информации о текущей сессии
 * @access Private
 */
router.get('/session', authenticate, authController.getCurrentSession.bind(authController));

export default router; 