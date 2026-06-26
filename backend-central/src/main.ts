import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

/**
 * Point d'entrée du backend central "siège".
 * Écoute sur le port 3002 par défaut.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuration Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FutureKawa Central API')
    .setDescription(
      'Central backend API documentation for FutureKawa. This service aggregates data from Brazil, Ecuador and Colombia country services. Includes authentication (JWT), email (MailHog), ERP connector, and health monitoring.',
    )
    .setVersion('2.0')
    .addTag('central', 'Agrégation des données pays')
    .addTag('auth', 'Authentification JWT')
    .addTag('email', 'Notification email via MailHog')
    .addTag('erp', 'Connecteur ERP simulé')
    .addTag('health', 'Monitoring et health check')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env.PORT || 3002;
  await app.listen(port);

  logger.log(`🏢 Backend Central démarré sur http://localhost:${port}`);
  logger.log(`📖 Swagger disponible sur http://localhost:${port}/api/docs`);
  logger.log(`🔐 Auth : POST http://localhost:${port}/api/auth/login`);
  logger.log(`📧 Email : GET http://localhost:${port}/api/central/email/test-alert`);
  logger.log(`📊 ERP : GET http://localhost:${port}/api/erp/lots`);
  logger.log(`❤️ Health : GET http://localhost:${port}/api/health`);
}
bootstrap();