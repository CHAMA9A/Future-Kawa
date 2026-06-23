import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsService } from './measurements.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MeasurementsService (Colombia)', () => {
  let service: MeasurementsService;
  let prisma: PrismaService;

  const mockPrisma = {
    sensorMeasurement: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    alert: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MeasurementsService>(MeasurementsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a measurement within normal thresholds (no alert)', async () => {
      const dto = {
        warehouseName: 'Warehouse Colombia 1',
        temperature: 26,
        humidity: 80,
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue({
        id: 1, ...dto, measuredAt: new Date(),
      });

      const result = await service.create(dto);

      expect(mockPrisma.sensorMeasurement.create).toHaveBeenCalledWith({
        data: { warehouseName: 'Warehouse Colombia 1', temperature: 26, humidity: 80 },
      });
      expect(mockPrisma.alert.create).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should create an alert when temperature is out of range', async () => {
      const dto = {
        warehouseName: 'Warehouse Colombia 1',
        temperature: 35,
        humidity: 80,
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue({
        id: 2, ...dto, measuredAt: new Date(),
      });

      await service.create(dto);

      expect(mockPrisma.alert.create).toHaveBeenCalledWith({
        data: {
          type: 'TEMPERATURE',
          message: expect.stringContaining('Température hors seuil'),
        },
      });
    });

    it('should create an alert when humidity is out of range', async () => {
      const dto = {
        warehouseName: 'Warehouse Colombia 1',
        temperature: 26,
        humidity: 95,
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue({
        id: 3, ...dto, measuredAt: new Date(),
      });

      await service.create(dto);

      expect(mockPrisma.alert.create).toHaveBeenCalledWith({
        data: {
          type: 'HUMIDITY',
          message: expect.stringContaining('Humidité hors seuil'),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all measurements', async () => {
      const measurements = [
        { id: 2, warehouseName: 'Warehouse Colombia 1', temperature: 27, humidity: 80, measuredAt: new Date() },
        { id: 1, warehouseName: 'Warehouse Colombia 1', temperature: 26, humidity: 79, measuredAt: new Date() },
      ];

      mockPrisma.sensorMeasurement.findMany.mockResolvedValue(measurements);
      const result = await service.findAll();

      expect(mockPrisma.sensorMeasurement.findMany).toHaveBeenCalledWith({
        orderBy: { measuredAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('findByWarehouse', () => {
    it('should return measurements filtered by warehouse', async () => {
      const measurements = [
        { id: 1, warehouseName: 'Warehouse Colombia 1', temperature: 26, humidity: 80, measuredAt: new Date() },
      ];

      mockPrisma.sensorMeasurement.findMany.mockResolvedValue(measurements);
      const result = await service.findByWarehouse('Warehouse Colombia 1');

      expect(mockPrisma.sensorMeasurement.findMany).toHaveBeenCalledWith({
        where: { warehouseName: 'Warehouse Colombia 1' },
        orderBy: { measuredAt: 'desc' },
      });
      expect(result).toEqual(measurements);
    });
  });
});