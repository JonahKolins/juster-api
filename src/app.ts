import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Создание экземпляра Express приложения
const app: Express = express();

// Настройка middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

// Настройка CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Маршруты API
app.use('/api', routes);

// Обработка ошибок
app.use(notFoundHandler);
app.use(errorHandler);

export default app; 