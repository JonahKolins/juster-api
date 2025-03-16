import { User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { AppError } from '../utils/api-response';
import { CreateUserDto, RegisterUserDto, UpdateUserDto, UserResponse } from '../types';

/**
 * Класс сервиса для работы с пользователями
 */
class UserService {
  /**
   * Регистрация нового пользователя (для публичной регистрации)
   */
  async register(userData: RegisterUserDto): Promise<UserResponse> {
    // Проверка существования пользователя с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw AppError.badRequest('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await this.hashPassword(userData.password);

    // Создание пользователя (только с ролью CLIENT)
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: UserRole.CLIENT,
      },
    });

    return this.excludePassword(newUser);
  }

  /**
   * Создание нового пользователя администратором
   */
  async createByAdmin(userData: CreateUserDto): Promise<UserResponse> {
    // Проверка существования пользователя с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw AppError.badRequest('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await this.hashPassword(userData.password);

    // Создание пользователя с указанной ролью
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
      },
    });

    return this.excludePassword(newUser);
  }

  /**
   * Получение пользователя по ID
   */
  async getUserById(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('Пользователь не найден');
    }

    return this.excludePassword(user);
  }

  /**
   * Получение пользователя по email
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw AppError.notFound('Пользователь не найден');
    }

    return user;
  }

  /**
   * Обновление данных пользователя
   */
  async updateUser(userId: string, userData: UpdateUserDto): Promise<UserResponse> {
    // Проверка существования пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('Пользователь не найден');
    }

    // Проверка уникальности email, если он меняется
    if (userData.email && userData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw AppError.badRequest('Пользователь с таким email уже существует');
      }
    }

    // Обработка пароля, если он меняется
    const updateData: any = { ...userData };
    if (userData.password) {
      updateData.password = await this.hashPassword(userData.password);
    }

    // Обновление пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.excludePassword(updatedUser);
  }

  /**
   * Удаление пользователя
   */
  async deleteUser(userId: string): Promise<void> {
    // Проверка существования пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('Пользователь не найден');
    }

    // Удаление пользователя
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Получение списка всех пользователей
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  /**
   * Проверка пароля пользователя
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Хеширование пароля
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Исключение пароля из ответа
   */
  private excludePassword(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new UserService(); 