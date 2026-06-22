import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * AlertsService
 *
 * Gère la consultation des alertes et la vérification des lots périmés.
 * Un lot est considéré comme périmé si sa date de stockage dépasse 365 jours.
 */
@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retourne toutes les alertes, de la plus récente à la plus ancienne.
   */
  async findAll() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Vérifie les lots dont la date de stockage dépasse 365 jours.
   *
   * Pour chaque lot périmé :
   * - Son statut passe à PERIME
   * - Une alerte de type EXPIRED_LOT est créée
   * - Un email simulé est loggé dans la console
   */
  async checkExpiredLots() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Recherche les lots stockés depuis plus d'un an et pas encore marqués PERIME
    const expiredLots = await this.prisma.coffeeLot.findMany({
      where: {
        storageDate: { lte: oneYearAgo },
        status: { not: 'PERIME' },
      },
    });

    this.logger.log(
      `Vérification lots périmés : ${expiredLots.length} lot(s) trouvé(s)`,
    );

    const results: Array<{ id: number; type: string; message: string; status: string; createdAt: Date }> = [];

    for (const lot of expiredLots) {
      // Mettre à jour le statut du lot
      await this.prisma.coffeeLot.update({
        where: { id: lot.id },
        data: { status: 'PERIME' },
      });

      // Créer une alerte EXPIRED_LOT
      const alert = await this.prisma.alert.create({
        data: {
          type: 'EXPIRED_LOT',
          message: `Lot ${lot.lotCode} périmé - stocké depuis le ${lot.storageDate.toISOString().split('T')[0]} (entrepôt : ${lot.warehouseName})`,
        },
      });

      // Simulation d'envoi d'email
      this.logger.warn(`LOT PÉRIMÉ : ${lot.lotCode}`);
      this.logger.log(`📧 EMAIL SIMULÉ ENVOYÉ À brazil.manager@futurekawa.com`);
      this.logger.log(`   Type alerte : EXPIRED_LOT`);
      this.logger.log(`   Message : Lot ${lot.lotCode} a dépassé 365 jours de stockage`);

      results.push(alert);
    }

    return {
      expiredLotsFound: expiredLots.length,
      alertsCreated: results.length,
      alerts: results,
    };
  }
}