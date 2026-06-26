import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { getAlertThresholds } from '../config/alert-thresholds';

/**
 * MeasurementsService
 *
 * Gère l'enregistrement des mesures IoT (température et humidité)
 * et déclenche les alertes automatiques en cas de dépassement des seuils.
 */
@Injectable()
export class MeasurementsService {
  private readonly logger = new Logger(MeasurementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une mesure et vérifie les seuils.
   * Si la température ou l'humidité dépasse les tolérances,
   * une alerte est automatiquement créée et un email simulé est loggé.
   */
  async create(createMeasurementDto: CreateMeasurementDto) {
    const { warehouseName, temperature, humidity } = createMeasurementDto;

    // 1. Enregistrer la mesure en base
    const measurement = await this.prisma.sensorMeasurement.create({
      data: { warehouseName, temperature, humidity },
    });

    this.logger.log(
      `Mesure enregistrée : ${temperature}°C, ${humidity}% (${warehouseName})`,
    );

    // 2. Vérifier les seuils et créer des alertes si nécessaire
    await this.checkThresholds(warehouseName, temperature, humidity);

    return measurement;
  }

  /**
   * Vérifie si la température et l'humidité sont dans les plages acceptables.
   * Crée une alerte pour chaque seuil dépassé.
   */
  private async checkThresholds(
    warehouseName: string,
    temperature: number,
    humidity: number,
  ) {
    const thresholds = getAlertThresholds();

    if (
      temperature < thresholds.temperature.min ||
      temperature > thresholds.temperature.max
    ) {
      await this.createAlert(
        'TEMPERATURE',
        `Température hors seuil dans ${warehouseName} : ${temperature}°C (plage acceptable : ${thresholds.temperature.min}°C - ${thresholds.temperature.max}°C)`,
      );
    }

    if (
      humidity < thresholds.humidity.min ||
      humidity > thresholds.humidity.max
    ) {
      await this.createAlert(
        'HUMIDITY',
        `Humidité hors seuil dans ${warehouseName} : ${humidity}% (plage acceptable : ${thresholds.humidity.min}% - ${thresholds.humidity.max}%)`,
      );
    }
  }

  /**
   * Crée une alerte en base et simule l'envoi d'un email.
   */
  private async createAlert(type: string, message: string) {
    const alert = await this.prisma.alert.create({
      data: { type: type as any, message },
    });

    this.logger.warn(`ALERTE CRÉÉE : ${type} - ${message}`);

    // Simulation d'envoi d'email
    this.logger.log(`📧 EMAIL SIMULÉ ENVOYÉ À ecuador.manager@futurekawa.com`);
    this.logger.log(`   Type alerte : ${type}`);
    this.logger.log(`   Message : ${message}`);

    return alert;
  }

  /**
   * Retourne toutes les mesures, de la plus récente à la plus ancienne.
   */
  async findAll() {
    return this.prisma.sensorMeasurement.findMany({
      orderBy: { measuredAt: 'desc' },
    });
  }

  /**
   * Retourne les mesures filtrées par entrepôt.
   */
  async findByWarehouse(warehouseName: string) {
    return this.prisma.sensorMeasurement.findMany({
      where: { warehouseName },
      orderBy: { measuredAt: 'desc' },
    });
  }
}
