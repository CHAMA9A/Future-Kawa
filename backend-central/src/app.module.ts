import { Module } from '@nestjs/common';
import { CentralModule } from './central/central.module';

/**
 * AppModule
 *
 * Module racine du backend central "siège".
 * Importe CentralModule qui expose les routes d'agrégation.
 */
@Module({
  imports: [CentralModule],
})
export class AppModule {}