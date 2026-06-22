import { Controller, Get, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';

/**
 * AlertsController
 *
 * Routes pour la gestion des alertes.
 *
 * GET  /api/alerts                    → Lister toutes les alertes
 * POST /api/alerts/check-expired-lots → Vérifier les lots périmés
 */
@Controller('api/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll() {
    return this.alertsService.findAll();
  }

  @Post('check-expired-lots')
  async checkExpiredLots() {
    return this.alertsService.checkExpiredLots();
  }
}