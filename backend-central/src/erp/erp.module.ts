import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ErpController } from './erp.controller';
import { ErpService } from './erp.service';

/**
 * ErpModule
 *
 * Module de connecteur ERP pour FutureKawa.
 * Simule une interface d'intégration avec des ERP externes (SAP, Odoo, Dynamics).
 *
 * Les endpoints ERP réutilisent les endpoints pays via le CentralService
 * et les exposent dans un format standardisé compatible ERP.
 *
 * Endpoints :
 * - GET /api/erp/lots     -> lots format ERP
 * - GET /api/erp/alerts   -> alertes format ERP
 * - POST /api/erp/sync    -> synchronisation simulée
 *
 * Note : il s'agit d'une simulation d'intégration.
 * En production, remplacer par des connecteurs ERP réels.
 */
@Module({
  imports: [HttpModule],
  controllers: [ErpController],
  providers: [ErpService],
  exports: [ErpService],
})
export class ErpModule {}