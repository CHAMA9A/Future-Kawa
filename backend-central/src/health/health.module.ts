import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * HealthModule
 *
 * Module de monitoring et health check.
 * Permet de vérifier l'état de santé du backend central
 * et des services pays.
 */
@Module({
  imports: [HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}