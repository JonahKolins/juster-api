import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import config from '../config/config';

// Создание access токена
export const generateAccessToken = (payload: UserPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpirationTime,
  });
};

// Создание refresh токена
export const generateRefreshToken = (payload: UserPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpirationTime,
  });
};

// Верификация access токена
export const verifyAccessToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as UserPayload;
  } catch (error) {
    return null;
  }
};

// Верификация refresh токена
export const verifyRefreshToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as UserPayload;
  } catch (error) {
    return null;
  }
};

// Получение времени истечения refresh токена
export const getRefreshTokenExpiration = (): Date => {
  const expirationTime = config.jwt.refreshExpirationTime;
  const timeValue = parseInt(expirationTime.slice(0, -1), 10);
  const timeUnit = expirationTime.slice(-1);
  
  const expirationDate = new Date();
  
  switch (timeUnit) {
    case 'd':
      expirationDate.setDate(expirationDate.getDate() + timeValue);
      break;
    case 'h':
      expirationDate.setHours(expirationDate.getHours() + timeValue);
      break;
    case 'm':
      expirationDate.setMinutes(expirationDate.getMinutes() + timeValue);
      break;
    case 's':
      expirationDate.setSeconds(expirationDate.getSeconds() + timeValue);
      break;
    default:
      // По умолчанию - 7 дней
      expirationDate.setDate(expirationDate.getDate() + 7);
  }
  
  return expirationDate;
}; 