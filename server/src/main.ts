import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilitar CORS para permitir peticiones del frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend Next.js
    credentials: true,
  });

  // Puerto 3002 para el backend (cambiado temporalmente por conflicto en 3001)
  await app.listen(3002);
  console.log('🚀 Backend corriendo en http://localhost:3002');
}
bootstrap();
