import { Module } from '@nestjs/common';
import { CentralModule } from './central/central.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ErpModule } from './erp/erp.module';
import { HealthModule } from './health/health.module';

/**
 * AppModule
 *
 * Module racine du backend central "siège".
 * Importe tous les modules fonctionnels :
 * - CentralModule : agrégation des données pays
 * - AuthModule : authentification JWT
 * - EmailModule : envoi d'emails via MailHog
 * - ErpModule : connecteur ERP simulé
 * - HealthModule : monitoring et health check
 */
@Module({
  imports: [
    CentralModule,
    AuthModule,
    EmailModule,
    ErpModule,
    HealthModule,
  ],
})
export class AppModule {}