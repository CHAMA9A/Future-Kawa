import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Point d'entrée de l'application NestJS.
 *
 * - Crée l'application à partir du module racine AppModule
 * - Active la validation globale des DTO avec ValidationPipe
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

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Brazil Service démarré sur http://localhost:${port}`);
}
bootstrap();