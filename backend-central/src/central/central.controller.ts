import { Controller, Get, Put, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
 * - GET /api/central/:country/thresholds
 * - PUT /api/central/:country/thresholds
 * - POST /api/central/:country/thresholds/reset
 */
@ApiTags('central')
@Controller('api/central')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Get list of available countries' })
  @ApiResponse({ status: 200, description: 'List of countries returned successfully' })
  getCountries() {
    return this.centralService.getCountries();
  }

  @Get(':country/lots')
  @ApiOperation({ summary: 'Get coffee lots for a specific country' })
  @ApiResponse({ status: 200, description: 'List of coffee lots returned successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getLots(@Param('country') country: string) {
    return this.centralService.getLots(country);
  }

  @Get(':country/lots/fifo')
  @ApiOperation({ summary: 'Get coffee lots ordered by FIFO for a specific country' })
  @ApiResponse({ status: 200, description: 'FIFO list of coffee lots returned successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getLotsFifo(@Param('country') country: string) {
    return this.centralService.getLotsFifo(country);
  }

  @Get(':country/measurements')
  @ApiOperation({ summary: 'Get sensor measurements for a specific country' })
  @ApiResponse({ status: 200, description: 'List of measurements returned successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getMeasurements(@Param('country') country: string) {
    return this.centralService.getMeasurements(country);
  }

  @Get(':country/alerts')
  @ApiOperation({ summary: 'Get alerts for a specific country' })
  @ApiResponse({ status: 200, description: 'List of alerts returned successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getAlerts(@Param('country') country: string) {
    return this.centralService.getAlerts(country);
  }

  @Get(':country/thresholds')
  @ApiOperation({ summary: 'Get alert thresholds for a specific country' })
  @ApiResponse({ status: 200, description: 'Thresholds returned successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getThresholds(@Param('country') country: string) {
    return this.centralService.getThresholds(country);
  }

  @Put(':country/thresholds')
  @ApiOperation({ summary: 'Update alert thresholds for a specific country' })
  @ApiResponse({ status: 200, description: 'Thresholds updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid threshold values' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async updateThresholds(
    @Param('country') country: string,
    @Body() thresholds: any,
  ) {
    return this.centralService.updateThresholds(country, thresholds);
  }

  @Post(':country/thresholds/reset')
  @ApiOperation({ summary: 'Reset alert thresholds to defaults for a specific country' })
  @ApiResponse({ status: 200, description: 'Thresholds reset to defaults' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async resetThresholds(@Param('country') country: string) {
    return this.centralService.resetThresholds(country);
  }
}
