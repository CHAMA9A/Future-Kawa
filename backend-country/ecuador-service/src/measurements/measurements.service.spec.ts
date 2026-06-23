import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsService } from './measurements.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MeasurementsService (Ecuador)', () => {
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
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a measurement within normal thresholds (no alert)', async () => {
      const dto = {
        warehouseName: 'Warehouse Ecuador 1',
        temperature: 31,
        humidity: 60,
      };

      const expected = {
        id: 1,
        warehouseName: 'Warehouse Ecuador 1',
        temperature: 31,
        humidity: 60,
        measuredAt: new Date(),
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue(expected);
      const result = await service.create(dto);

      expect(mockPrisma.sensorMeasurement.create).toHaveBeenCalledWith({
        data: { warehouseName: 'Warehouse Ecuador 1', temperature: 31, humidity: 60 },
      });
      expect(mockPrisma.alert.create).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should create an alert when temperature is out of range', async () => {
      const dto = {
        warehouseName: 'Warehouse Ecuador 1',
        temperature: 40,
        humidity: 60,
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
        warehouseName: 'Warehouse Ecuador 1',
        temperature: 31,
        humidity: 90,
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
    it('should return all measurements ordered by measuredAt desc', async () => {
      const measurements = [
        { id: 2, warehouseName: 'Warehouse Ecuador 1', temperature: 32, humidity: 61, measuredAt: new Date('2024-06-15T10:00:00.000Z') },
        { id: 1, warehouseName: 'Warehouse Ecuador 1', temperature: 31, humidity: 60, measuredAt: new Date('2024-06-01T10:00:00.000Z') },
      ];

      mockPrisma.sensorMeasurement.findMany.mockResolvedValue(measurements);
      const result = await service.findAll();

      expect(mockPrisma.sensorMeasurement.findMany).toHaveBeenCalledWith({
        orderBy: { measuredAt: 'desc' },
      });
      expect(result).toEqual(measurements);
    });
  });

  describe('findByWarehouse', () => {
    it('should return measurements filtered by warehouse name', async () => {
      const measurements = [
        { id: 1, warehouseName: 'Warehouse Ecuador 1', temperature: 31, humidity: 60, measuredAt: new Date() },
      ];

      mockPrisma.sensorMeasurement.findMany.mockResolvedValue(measurements);
      const result = await service.findByWarehouse('Warehouse Ecuador 1');

      expect(mockPrisma.sensorMeasurement.findMany).toHaveBeenCalledWith({
        where: { warehouseName: 'Warehouse Ecuador 1' },
        orderBy: { measuredAt: 'desc' },
      });
      expect(result).toEqual(measurements);
    });
  });
});