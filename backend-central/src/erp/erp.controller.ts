import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ErpService } from './erp.service';

/**
 * ErpController
 *
 * Endpoints d'intégration ERP au format standardisé.
 * Tous les endpoints sont préfixés par /api/erp.
 */
@ApiTags('erp')
@Controller('api/erp')
export class ErpController {
  private readonly logger = new Logger(ErpController.name);

  constructor(private readonly erpService: ErpService) {}

  @Get('lots')
  @ApiOperation({
    summary: 'Récupérer les lots au format ERP',
    description:
      'Retourne les lots de tous les pays dans un format standardisé compatible ERP. Paramètre optionnel : system (SAP, Odoo, Dynamics).',
  })
  @ApiQuery({
    name: 'system',
    required: false,
    description: 'Système ERP externe (SAP, Odoo, Dynamics)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lots au format ERP retournés',
  })
  async getLots(@Query('system') system?: string) {
    return this.erpService.getLots(system);
  }

  @Get('alerts')
  @ApiOperation({
    summary: 'Récupérer les alertes au format ERP',
    description:
      'Retourne les alertes de tous les pays dans un format standardisé compatible ERP.',
  })
  @ApiQuery({
    name: 'system',
    required: false,
    description: 'Système ERP externe (SAP, Odoo, Dynamics)',
  })
  @ApiResponse({
    status: 200,
    description: 'Alertes au format ERP retournées',
  })
  async getAlerts(@Query('system') system?: string) {
    return this.erpService.getAlerts(system);
  }

  @Post('sync')
  @ApiOperation({
    summary: 'Déclencher une synchronisation ERP',
    description:
      'Simule une synchronisation avec un ERP externe. Reçoit un payload au format standardisé.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        externalSystem: {
          type: 'string',
          example: 'SAP',
          description: 'SAP, Odoo ou Dynamics',
        },
        payload: {
          type: 'object',
          description: 'Données à synchroniser',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Synchronisation ERP simulée avec succès',
  })
  async sync(
    @Body()
    body: {
      externalSystem: string;
      payload: Record<string, any>;
    },
  ) {
    return this.erpService.sync(body.externalSystem, body.payload);
  }
}