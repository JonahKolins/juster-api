import { Request } from 'express';
import { Session } from '@prisma/client';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiration, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/api-response';
import { LoginUserDto, RegisterUserDto, SessionResponse, UserResponse } from '../types';
import userService from './user.service';

/**
 * Класс сервиса для работы с аутентификацией и сессиями
 */
class AuthService {

    /**
     * Регистрация нового пользователя
     */
    async register(userData: RegisterUserDto): Promise<UserResponse> {
        return userService.register(userData);
    }

    /**
     * Аутентификация пользователя
     */
    async login(loginData: LoginUserDto, req: Request): Promise<{ user: UserResponse; refreshToken: string; accessToken: string }> {
        try {
            // Получение пользователя по email
            const user = await userService.getUserByEmail(loginData.email);

            // Проверка пароля
            const isPasswordValid = await userService.validatePassword(loginData.password, user.password);

            if (!isPasswordValid) {
                throw AppError.unauthorized('Неверный email или пароль');
            }

            // Генерация токенов
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            // Получение информации о клиенте
            const userAgent = req.headers['user-agent'] || '';
            const ipAddress = req.ip || '';

            // Расчет времени истечения refresh токена
            const expiresAt = getRefreshTokenExpiration();

            // Создание сессии
            await this.createSession({
                userId: user.id,
                refreshToken,
                userAgent,
                ipAddress,
                expiresAt,
            });

            // Получаем данные пользователя без пароля
            const userResponse = await userService.getUserById(user.id);

            return {
                user: userResponse,
                refreshToken,
                accessToken,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw AppError.unauthorized('Ошибка аутентификации');
        }
    }

    /**
     * Выход из системы
     */
    async logout(refreshToken: string): Promise<void> {
        try {
            // Удаление сессии по refresh токену
            await prisma.session.deleteMany({ where: { refreshToken } });
        } catch (error) {
            throw AppError.internal('Ошибка при выходе из системы');
        }
    }

    /**
     * Обновление токенов с помощью refresh токена
     */
    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            // Верификация refresh токена
            const payload = verifyRefreshToken(refreshToken);
            
            if (!payload) {
                throw AppError.unauthorized('Недействительный refresh токен');
            }
            
            // Поиск сессии по refresh токену
            const session = await prisma.session.findFirst({
                where: {
                refreshToken,
                },
                include: {
                user: true,
                },
            });
            
            if (!session) {
                throw AppError.unauthorized('Сессия не найдена');
            }
            
            // Проверка срока действия
            if (new Date() > session.expiresAt) {
                await this.logout(refreshToken);
                throw AppError.unauthorized('Срок действия сессии истек');
            }
            
            // Создание новых токенов
            const newPayload = {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
            };
            
            const newAccessToken = generateAccessToken(newPayload);
            const newRefreshToken = generateRefreshToken(newPayload);
            
            // Обновление сессии
            const expiresAt = getRefreshTokenExpiration();
            
            await prisma.session.update({
                where: { id: session.id },
                data: {
                refreshToken: newRefreshToken,
                expiresAt,
                updatedAt: new Date(),
                },
            });
            
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw AppError.unauthorized('Ошибка обновления токена');
        }
    }

    /**
     * Создание новой сессии
     */
    async createSession(sessionData: {
        userId: string;
        refreshToken: string;
        userAgent?: string;
        ipAddress?: string;
        expiresAt: Date;
    }): Promise<Session> {
        return prisma.session.create({
            data: sessionData,
        });
    }

    /**
     * Получение всех сессий пользователя
     */
    async getUserSessions(userId: string): Promise<SessionResponse[]> {
        const sessions = await prisma.session.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return sessions.map(this.formatSessionResponse);
    }

    /**
     * Удаление всех сессий пользователя
     */
    async deleteUserSessions(userId: string): Promise<void> {
        await prisma.session.deleteMany({
            where: { userId },
        });
    }

    /**
     * Форматирование ответа сессии
     */
    private formatSessionResponse(session: Session): SessionResponse {
        return {
            id: session.id,
            userAgent: session.userAgent || undefined,
            ipAddress: session.ipAddress || undefined,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
        };
    }
}

export default new AuthService(); 