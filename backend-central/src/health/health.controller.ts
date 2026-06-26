import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

/**
 * HealthController
 *
 * Endpoint de health check du système.
 * GET /api/health -> état de santé global
 */
@ApiTags('health')
@Controller('api/health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Vérifier la santé du système',
    description:
      'Retourne l\'état de santé du backend central et de tous les services pays (Brazil, Ecuador, Colombia).',
  })
  @ApiResponse({
    status: 200,
    description: 'Rapport de santé du système',
  })
  async check() {
    this.logger.log('Health check demandé');
    return this.healthService.check();
  }
}