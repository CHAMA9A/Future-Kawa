import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Point d'entrée du backend central "siège".
 * Écoute sur le port 3002 par défaut.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🏢 Backend Central démarré sur http://localhost:${port}`);
}
bootstrap();