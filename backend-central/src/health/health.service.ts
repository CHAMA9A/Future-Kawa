import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Configuration des services à monitorer.
 */
const SERVICES: Record<string, string> = {
  'Brazil Service': process.env.BRAZIL_SERVICE_URL || 'http://localhost:3001',
  'Ecuador Service':
    process.env.ECUADOR_SERVICE_URL || 'http://localhost:3011',
  'Colombia Service':
    process.env.COLOMBIA_SERVICE_URL || 'http://localhost:3012',
};

/**
 * HealthService
 *
 * Vérifie l'état de santé de tous les services du système.
 * Retourne un rapport détaillé avec le statut de chaque service.
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Vérifie la santé du backend central et de tous les services pays.
   * Chaque service est testé via un GET sur sa racine.
   */
  async check(): Promise<any> {
    this.logger.log('Vérification de santé globale du système');

    const statuses: Record<string, any> = {};
    let allAvailable = true;

    for (const [name, url] of Object.entries(SERVICES)) {
      try {
        const start = Date.now();
        await firstValueFrom(this.httpService.get(url, { timeout: 5000 }));
        const latency = Date.now() - start;

        statuses[name] = {
          status: 'available',
          latency: `${latency}ms`,
          url,
        };
        this.logger.log(`Health : ${name} -> disponible (${latency}ms)`);
      } catch (error) {
        statuses[name] = {
          status: 'unavailable',
          url,
          error: error.message,
        };
        allAvailable = false;
        this.logger.warn(`Health : ${name} -> indisponible`);
      }
    }

    return {
      status: allAvailable ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      services: statuses,
    };
  }
}