import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Point d'entrée de l'application NestJS.
 *
 * - Crée l'application à partir du module racine AppModule
 * - Active la validation globale des DTO avec ValidationPipe
 * - Configure Swagger / OpenAPI sur /api/docs
 * - Écoute sur le port défini dans .env (défaut: 3001)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation automatique des DTO (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Rejette les propriétés inconnues
      transform: true, // Transforme automatiquement les types
    }),
  );

  // Configuration Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FutureKawa Brazil Service API')
    .setDescription('API documentation for FutureKawa Brazil Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Brazil Service démarré sur http://localhost:${port}`);
  console.log(`📖 Swagger disponible sur http://localhost:${port}/api/docs`);
}
bootstrap();