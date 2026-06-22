import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LotsModule } from './lots/lots.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { AlertsModule } from './alerts/alerts.module';
import { MqttModule } from './mqtt/mqtt.module';

/**
 * AppModule
 *
 * Module racine de l'application.
 * Il importe tous les modules nécessaires :
 * - PrismaModule : accès à la base de données PostgreSQL
 * - LotsModule : gestion des lots de café
 * - MeasurementsModule : gestion des mesures IoT
 * - AlertsModule : gestion des alertes
 * - MqttModule : intégration MQTT (réception des mesures IoT)
 */
@Module({
  imports: [
    PrismaModule,
    LotsModule,
    MeasurementsModule,
    AlertsModule,
    MqttModule,
  ],
})
export class AppModule {}