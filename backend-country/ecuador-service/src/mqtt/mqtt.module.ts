import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MeasurementsModule } from '../measurements/measurements.module';

/**
 * MqttModule
 *
 * Module NestJS pour l'intégration MQTT.
 * Importe MeasurementsModule pour pouvoir injecter MeasurementsService
 * et enregistrer les mesures reçues via le broker Mosquitto.
 */
@Module({
  imports: [MeasurementsModule],
  providers: [MqttService],
})
export class MqttModule {}