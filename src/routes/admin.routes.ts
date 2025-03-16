import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Все маршруты защищены middleware authenticate и isAdmin
router.use(authenticate, isAdmin);

/**
 * @route GET /api/admin/users
 * @desc Получение списка всех пользователей
 * @access Admin
 */
router.get('/users', userController.getAllUsers.bind(userController));

/**
 * @route GET /api/admin/users/:userId
 * @desc Получение пользователя по ID
 * @access Admin
 */
router.get('/users/:userId', userController.getUserById.bind(userController));

/**
 * @route POST /api/admin/users
 * @desc Создание нового пользователя
 * @access Admin
 */
router.post('/users', userController.createUser.bind(userController));

/**
 * @route PUT /api/admin/users/:userId
 * @desc Обновление пользователя по ID
 * @access Admin
 */
router.put('/users/:userId', userController.updateUser.bind(userController));

/**
 * @route DELETE /api/admin/users/:userId
 * @desc Удаление пользователя по ID
 * @access Admin
 */
router.delete('/users/:userId', userController.deleteUser.bind(userController));

/**
 * @route GET /api/admin/users/:userId/sessions
 * @desc Получение сессий пользователя по ID
 * @access Admin
 */
router.get('/users/:userId/sessions', userController.getUserSessionsById.bind(userController));

export default router; 