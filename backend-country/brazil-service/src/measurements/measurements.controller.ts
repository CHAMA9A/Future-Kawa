import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

/**
 * MeasurementsController
 *
 * Routes pour la gestion des mesures IoT (température / humidité).
 *
 * POST /api/measurements                          → Créer une mesure + alerte auto si hors seuil
 * GET  /api/measurements                          → Lister toutes les mesures
 * GET  /api/measurements/warehouse/:warehouseName  → Filtrer par entrepôt
 */
@Controller('api/measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  async create(@Body() createMeasurementDto: CreateMeasurementDto) {
    return this.measurementsService.create(createMeasurementDto);
  }

  @Get()
  async findAll() {
    return this.measurementsService.findAll();
  }

  @Get('warehouse/:warehouseName')
  async findByWarehouse(@Param('warehouseName') warehouseName: string) {
    return this.measurementsService.findByWarehouse(warehouseName);
  }
}