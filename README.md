# Juster API

Бэкенд API для аутентификации и управления пользователями с использованием TypeScript, Express, JWT и Prisma ORM.

## Функциональность

- Регистрация и аутентификация пользователей
- Управление сессиями с использованием JWT (access и refresh токены)
- Разграничение доступа по ролям (клиент, компания, юрист, администратор)
- Административный функционал для управления пользователями
- Безопасное хранение паролей с использованием bcrypt
- HTTP-only cookies для хранения токенов

## Технологии

- TypeScript
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

## Требования

- Node.js (v14+)
- PostgreSQL

## Установка

1. Клонировать репозиторий:
```bash
git clone https://github.com/yourusername/juster-api.git
cd juster-api
```

2. Установить зависимости:
```bash
npm install
```

3. Настроить переменные окружения:
```bash
cp .env.example .env
```
Отредактировать файл `.env` с вашими настройками.

4. Настроить базу данных:
```bash
npm run migrate
```

5. Сгенерировать Prisma клиент:
```bash
npm run generate
```

## Запуск

### Режим разработки
```bash
npm run dev
```

### Сборка и запуск в продакшн
```bash
npm run build
npm start
```

## API Эндпоинты

### Аутентификация

- `POST /api/auth/register` - Регистрация нового пользователя (только роль "клиент")
- `POST /api/auth/login` - Аутентификация пользователя
- `POST /api/auth/logout` - Выход из системы
- `POST /api/auth/refresh` - Обновление токена сессии
- `GET /api/auth/session` - Получение информации о текущей сессии

### Пользователь

- `GET /api/user/profile` - Получение профиля текущего пользователя
- `PUT /api/user/profile` - Обновление профиля текущего пользователя
- `GET /api/user/sessions` - Получение сессий текущего пользователя

### Администратор

- `GET /api/admin/users` - Получение списка всех пользователей
- `GET /api/admin/users/:userId` - Получение пользователя по ID
- `POST /api/admin/users` - Создание нового пользователя (любая роль)
- `PUT /api/admin/users/:userId` - Обновление пользователя по ID
- `DELETE /api/admin/users/:userId` - Удаление пользователя по ID
- `GET /api/admin/users/:userId/sessions` - Получение сессий пользователя по ID


## Структура проекта

juster-api/
├── prisma/
│   └── schema.prisma       # Схема базы данных
├── src/
│   ├── config/             # Конфигурации
│   │   ├── config.ts       # Основная конфигурация
│   │   └── prisma.ts       # Клиент Prisma
│   ├── controllers/        # Контроллеры
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/         # Middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/             # Маршруты
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── index.ts
│   │   └── user.routes.ts
│   ├── services/           # Сервисы
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── types/              # TypeScript типы
│   │   └── index.ts
│   ├── utils/              # Утилиты
│   │   ├── api-response.ts
│   │   └── jwt.ts
│   ├── app.ts              # Основной файл приложения
│   └── server.ts           # Запуск сервера
├── .env                    # Переменные окружения
├── .env.example            # Пример переменных окружения
├── .gitignore              # Игнорируемые файлы Git
├── package.json            # Зависимости и скрипты
├── README.md               # Документация
└── tsconfig.json           # Настройки TypeScript

## Лицензия

ISC