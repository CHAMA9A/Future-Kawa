import { Module } from '@nestjs/common';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';

/**
 * LotsModule
 *
 * Module NestJS qui regroupe le controller et le service
 * pour la gestion des lots de café.
 */
@Module({
  controllers: [LotsController],
  providers: [LotsService],
})
export class LotsModule {}