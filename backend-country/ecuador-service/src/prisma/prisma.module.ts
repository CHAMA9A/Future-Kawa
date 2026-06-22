import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule
 *
 * Module global qui fournit PrismaService à toute l'application.
 * Le décorateur @Global() évite d'importer PrismaModule dans chaque module.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}