import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Configuration des pays disponibles.
 * Associe un code pays à son nom, statut et URL de service.
 */
export interface CountryConfig {
  code: string;
  name: string;
  status: string;
  serviceUrl: string;
}

/**
 * CentralService
 *
 * Service central du "siège" qui interroge les backends pays.
 * Supporte le Brésil, l'Équateur et la Colombie.
 */
@Injectable()
export class CentralService {
  private readonly logger = new Logger(CentralService.name);
  private readonly countries: Record<string, CountryConfig> = {};

  constructor(private readonly httpService: HttpService) {
    this.countries = {
      brazil: {
        code: 'brazil',
        name: 'Brazil',
        status: 'available',
        serviceUrl:
          process.env.BRAZIL_SERVICE_URL || 'http://localhost:3001',
      },
      ecuador: {
        code: 'ecuador',
        name: 'Ecuador',
        status: 'available',
        serviceUrl:
          process.env.ECUADOR_SERVICE_URL || 'http://localhost:3011',
      },
      colombia: {
        code: 'colombia',
        name: 'Colombia',
        status: 'available',
        serviceUrl:
          process.env.COLOMBIA_SERVICE_URL || 'http://localhost:3012',
      },
    };
  }

  /**
   * Retourne la liste complète des pays avec leurs informations.
   */
  getCountries(): CountryConfig[] {
    return Object.values(this.countries);
  }

  /**
   * Retourne les lots d'un pays.
   */
  async getLots(country: string) {
    return this.fetchFromCountry(country, '/api/lots');
  }

  /**
   * Retourne les lots triés FIFO d'un pays.
   */
  async getLotsFifo(country: string) {
    return this.fetchFromCountry(country, '/api/lots/fifo');
  }

  /**
   * Retourne les mesures d'un pays.
   */
  async getMeasurements(country: string) {
    return this.fetchFromCountry(country, '/api/measurements');
  }

  /**
   * Retourne les alertes d'un pays.
   */
  async getAlerts(country: string) {
    return this.fetchFromCountry(country, '/api/alerts');
  }

  /**
   * Méthode générique pour interroger un backend pays via HTTP.
   * Valide d'abord que le pays existe, puis effectue l'appel.
   * Retourne une erreur structurée si le service est indisponible.
   */
  private async fetchFromCountry(country: string, path: string) {
    const config = this.countries[country];

    if (!config) {
      throw new NotFoundException(
        `Country "${country}" not found. Available: ${Object.keys(this.countries).join(', ')}`,
      );
    }

    const url = `${config.serviceUrl}${path}`;
    this.logger.log(`Appel au backend ${config.name} : GET ${url}`);

    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      return data;
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'appel au backend ${config.name} : GET ${url} - service indisponible`,
      );
      return {
        country: config.code,
        status: 'unavailable',
        message: 'Country service is unavailable',
      };
    }
  }
}