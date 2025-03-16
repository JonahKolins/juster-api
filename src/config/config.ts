import dotenv from 'dotenv';

// Загрузка переменных окружения из .env файла
dotenv.config();

// Объект конфигурации для приложения
const config = {
  // Настройки сервера
  server: {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Настройки JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_default_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_default_secret',
    accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Настройки CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Настройки cookie
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  }
};

export default config; 