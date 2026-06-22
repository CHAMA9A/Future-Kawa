import { Controller, Get, Param } from '@nestjs/common';
import { CentralService, CountryConfig } from './central.service';

/**
 * CentralController
 *
 * Controller du "siège" qui expose les routes d'agrégation.
 * Toutes les routes sont préfixées par /api/central.
 *
 * Routes génériques :
 * - GET /api/central/countries
 * - GET /api/central/:country/lots
 * - GET /api/central/:country/lots/fifo
 * - GET /api/central/:country/measurements
 * - GET /api/central/:country/alerts
 */
@Controller('api/central')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Get('countries')
  getCountries() {
    return this.centralService.getCountries();
  }

  @Get(':country/lots')
  async getLots(@Param('country') country: string) {
    return this.centralService.getLots(country);
  }

  @Get(':country/lots/fifo')
  async getLotsFifo(@Param('country') country: string) {
    return this.centralService.getLotsFifo(country);
  }

  @Get(':country/measurements')
  async getMeasurements(@Param('country') country: string) {
    return this.centralService.getMeasurements(country);
  }

  @Get(':country/alerts')
  async getAlerts(@Param('country') country: string) {
    return this.centralService.getAlerts(country);
  }
}