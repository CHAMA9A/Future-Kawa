import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Point d'entrée du backend central "siège".
 * Écoute sur le port 3002 par défaut.
 */
async function bootstrap() {
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
    .setDescription('Central backend API documentation for FutureKawa. This service aggregates data from Brazil, Ecuador and Colombia country services.')
    .setVersion('1.0')
    .addTag('central')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🏢 Backend Central démarré sur http://localhost:${port}`);
  console.log(`📖 Swagger disponible sur http://localhost:${port}/api/docs`);
}
bootstrap();