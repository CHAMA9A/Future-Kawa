import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MeasurementsService } from '../measurements/measurements.service';

/**
 * MqttService
 *
 * Service qui se connecte au broker Mosquitto, s'abonne au topic
 * des mesures IoT et enregistre les mesures reçues en base de données.
 *
 * Les mesures transitent par MeasurementsService, ce qui réutilise
 * automatiquement la logique d'alertes température/humidité existante.
 */
@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient | null = null;

  constructor(
    private readonly measurementsService: MeasurementsService,
  ) {}

  /**
   * Au démarrage du module, on tente de se connecter au broker MQTT.
   */
  onModuleInit() {
    this.connectToBroker();
  }

  /**
   * Se connecte au broker Mosquitto et s'abonne au topic de mesures.
   */
  private connectToBroker() {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    const topic =
      process.env.MQTT_TOPIC ||
      'futurekawa/brazil/warehouse-1/measurements';

    this.logger.log(`[MQTT] Tentative de connexion au broker : ${brokerUrl}`);

    try {
      this.client = mqtt.connect(brokerUrl);

      this.client.on('connect', () => {
        this.logger.log(`[MQTT] Connexion au broker réussie`);
        this.client?.subscribe(topic, (err) => {
          if (err) {
            this.logger.error(
              `[MQTT] Erreur d'abonnement au topic ${topic}`,
              err.message,
            );
          } else {
            this.logger.log(
              `[MQTT] Abonnement au topic : ${topic}`,
            );
          }
        });
      });

      this.client.on('message', async (receivedTopic, payload) => {
        this.logger.log(
          `[MQTT] Message reçu : ${payload.toString()}`,
        );
        await this.handleMessage(payload.toString());
      });

      this.client.on('error', (err) => {
        this.logger.error(
          `[MQTT] Erreur de connexion au broker : ${err.message}`,
        );
      });

      this.client.on('close', () => {
        this.logger.warn('[MQTT] Connexion au broker fermée');
      });

      this.client.on('offline', () => {
        this.logger.warn('[MQTT] Broker indisponible - tentative de reconnexion...');
      });
    } catch (err) {
      this.logger.error(
        `[MQTT] Impossible de créer la connexion au broker : ${err.message}`,
      );
    }
  }

  /**
   * Parse et traite un message MQTT reçu.
   * Appelle MeasurementsService.create() pour enregistrer la mesure
   * et déclencher la vérification des alertes.
   */
  private async handleMessage(rawPayload: string) {
    try {
      const data = JSON.parse(rawPayload);

      // Vérifier que le payload contient les champs obligatoires
      if (
        !data.warehouseName ||
        data.temperature === undefined ||
        data.humidity === undefined
      ) {
        this.logger.error(
          `[MQTT] Payload incomplet : warehouseName, temperature et humidity sont requis`,
        );
        return;
      }

      // Vérifier que les types sont corrects
      if (
        typeof data.warehouseName !== 'string' ||
        typeof data.temperature !== 'number' ||
        typeof data.humidity !== 'number'
      ) {
        this.logger.error(
          `[MQTT] Types invalides : warehouseName (string), temperature (number), humidity (number) attendus`,
        );
        return;
      }

      // Enregistrer la mesure via le service existant (réutilise la logique d'alertes)
      await this.measurementsService.create({
        warehouseName: data.warehouseName,
        temperature: data.temperature,
        humidity: data.humidity,
      });

      this.logger.log(`[MQTT] Mesure enregistrée depuis MQTT`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.logger.error(
          `[MQTT] JSON invalide reçu : ${rawPayload}`,
        );
      } else {
        this.logger.error(
          `[MQTT] Erreur lors du traitement du message : ${error.message}`,
        );
      }
    }
  }
}