import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService
 *
 * Service qui encapsule le client Prisma et gère la connexion à PostgreSQL.
 * Implémente OnModuleInit et OnModuleDestroy pour:
 * - Se connecter à la base de données au démarrage du module
 * - Se déconnecter proprement à l'arrêt de l'application
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('Connexion à PostgreSQL établie via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Connexion à PostgreSQL fermée');
  }
}