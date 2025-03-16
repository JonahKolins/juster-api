import { PrismaClient } from '@prisma/client';

// Создаем экземпляр Prisma Client
const prisma = new PrismaClient();

// Обработка ошибок подключения
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });

// Обработка закрытия приложения
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from the database');
});

export default prisma; 