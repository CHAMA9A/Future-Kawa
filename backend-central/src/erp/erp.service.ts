import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Configuration des services pays pour l'intégration ERP.
 */
const COUNTRY_SERVICES: Record<string, string> = {
  brazil: process.env.BRAZIL_SERVICE_URL || 'http://localhost:3001',
  ecuador: process.env.ECUADOR_SERVICE_URL || 'http://localhost:3011',
  colombia: process.env.COLOMBIA_SERVICE_URL || 'http://localhost:3012',
};

/**
 * ErpService
 *
 * Service de connecteur ERP. Expose les données FutureKawa
 * dans un format standardisé compatible ERP.
 *
 * L'intégration ERP réelle n'est pas développée.
 * Ce service simule le format de données qu'un ERP attendrait.
 */
@Injectable()
export class ErpService {
  private readonly logger = new Logger(ErpService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Récupère les lots de tous les pays au format ERP.
   */
  async getLots(externalSystem?: string): Promise<any> {
    this.logger.log(
      `Requête ERP lots - Système externe : ${externalSystem || 'non spécifié'}`,
    );

    const lotsByCountry: Record<string, any> = {};

    for (const [country, url] of Object.entries(COUNTRY_SERVICES)) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get(`${url}/api/lots`),
        );
        lotsByCountry[country] = data;
      } catch (err) {
        this.logger.warn(
          `ERP : service ${country} indisponible pour la récupération des lots`,
        );
        lotsByCountry[country] = { error: 'Service unavailable' };
      }
    }

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        externalSystem: externalSystem || null,
        totalCountries: Object.keys(COUNTRY_SERVICES).length,
        format: 'ERP-STANDARD-V1',
      },
      data: lotsByCountry,
    };
  }

  /**
   * Récupère les alertes de tous les pays au format ERP.
   */
  async getAlerts(externalSystem?: string): Promise<any> {
    this.logger.log(
      `Requête ERP alertes - Système externe : ${externalSystem || 'non spécifié'}`,
    );

    const alertsByCountry: Record<string, any> = {};

    for (const [country, url] of Object.entries(COUNTRY_SERVICES)) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get(`${url}/api/alerts`),
        );
        alertsByCountry[country] = data;
      } catch (err) {
        this.logger.warn(
          `ERP : service ${country} indisponible pour la récupération des alertes`,
        );
        alertsByCountry[country] = { error: 'Service unavailable' };
      }
    }

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        externalSystem: externalSystem || null,
        format: 'ERP-STANDARD-V1',
      },
      data: alertsByCountry,
    };
  }

  /**
   * Simule une synchronisation ERP.
   * En production, déclencherait un véritable échange de données.
   */
  async sync(externalSystem: string, payload: any): Promise<any> {
    this.logger.log(
      `Synchronisation ERP demandée - Système : ${externalSystem}`,
    );
    this.logger.log(
      `Payload reçu : ${JSON.stringify(payload).substring(0, 200)}...`,
    );

    const availableCountries = Object.keys(COUNTRY_SERVICES);
    const results: Record<string, any> = {};

    for (const country of availableCountries) {
      results[country] = {
        status: 'simulated',
        message: `Synchronisation simulée avec ${country} réussie`,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      externalSystem,
      syncId: `sync-${Date.now()}`,
      timestamp: new Date().toISOString(),
      countries: availableCountries,
      results,
      note: 'Synchronisation simulée. L\'intégration ERP réelle nécessite un connecteur dédié.',
    };
  }
}