import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LotsModule } from './lots/lots.module';

/**
 * AppModule
 *
 * Module racine de l'application.
 * Il importe tous les modules nécessaires :
 * - PrismaModule : accès à la base de données PostgreSQL
 * - LotsModule : gestion des lots de café
 */
@Module({
  imports: [PrismaModule, LotsModule],
})
export class AppModule {}