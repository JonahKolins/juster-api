import app from './app';
import config from './config/config';

// Получение порта из конфигурации
const PORT = config.server.port;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.server.nodeEnv} mode`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 