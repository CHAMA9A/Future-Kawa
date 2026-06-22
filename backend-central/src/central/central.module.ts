import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CentralController } from './central.controller';
import { CentralService } from './central.service';

/**
 * CentralModule
 *
 * Module central du "siège" qui agrège les données des backends pays.
 * Importe HttpModule pour effectuer les appels HTTP vers les backends pays.
 */
@Module({
  imports: [HttpModule],
  controllers: [CentralController],
  providers: [CentralService],
})
export class CentralModule {}