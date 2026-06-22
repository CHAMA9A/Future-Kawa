import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLotDto } from './dto/create-lot.dto';

/**
 * LotsService
 *
 * Contient la logique métier pour la gestion des lots de café :
 * - Création d'un nouveau lot
 * - Récupération de tous les lots
 * - Récupération des lots triés par date de stockage (FIFO)
 */
@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau lot de café à partir des données fournies.
   * Le statut initial est toujours "CONFORME".
   */
  async create(createLotDto: CreateLotDto) {
    return this.prisma.coffeeLot.create({
      data: {
        lotCode: createLotDto.lotCode,
        country: createLotDto.country || 'Brazil',
        warehouseName: createLotDto.warehouseName,
        storageDate: new Date(createLotDto.storageDate),
        status: 'CONFORME',
      },
    });
  }

  /**
   * Retourne tous les lots de café, du plus récent au plus ancien.
   */
  async findAll() {
    return this.prisma.coffeeLot.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retourne les lots triés par date de stockage croissante (FIFO).
   * Les lots les plus anciens sont affichés en premier,
   * pour savoir quels lots doivent sortir du stock en priorité.
   */
  async findFifo() {
    return this.prisma.coffeeLot.findMany({
      orderBy: { storageDate: 'asc' },
    });
  }
}