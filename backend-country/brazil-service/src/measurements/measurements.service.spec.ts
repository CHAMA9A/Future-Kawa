import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsService } from './measurements.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MeasurementsService (Brazil)', () => {
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
        warehouseName: 'Warehouse Brazil 1',
        temperature: 29,
        humidity: 55,
      };

      const expected = {
        id: 1,
        warehouseName: 'Warehouse Brazil 1',
        temperature: 29,
        humidity: 55,
        measuredAt: new Date(),
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(mockPrisma.sensorMeasurement.create).toHaveBeenCalledWith({
        data: { warehouseName: 'Warehouse Brazil 1', temperature: 29, humidity: 55 },
      });
      expect(mockPrisma.alert.create).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should create an alert when temperature is too high', async () => {
      const dto = {
        warehouseName: 'Warehouse Brazil 1',
        temperature: 38,
        humidity: 55,
      };

      const expectedMeasurement = {
        id: 2,
        warehouseName: 'Warehouse Brazil 1',
        temperature: 38,
        humidity: 55,
        measuredAt: new Date(),
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue(expectedMeasurement);
      mockPrisma.alert.create.mockResolvedValue({
        id: 1,
        type: 'TEMPERATURE',
        message: 'Température hors seuil dans Warehouse Brazil 1 : 38°C (plage acceptable : 26°C - 32°C)',
      });

      const result = await service.create(dto);

      expect(mockPrisma.alert.create).toHaveBeenCalledWith({
        data: {
          type: 'TEMPERATURE',
          message: expect.stringContaining('Température hors seuil'),
        },
      });
      expect(result).toEqual(expectedMeasurement);
    });

    it('should create an alert when temperature is too low', async () => {
      const dto = {
        warehouseName: 'Warehouse Brazil 1',
        temperature: 20,
        humidity: 55,
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue({
        id: 3,
        ...dto,
        measuredAt: new Date(),
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
        warehouseName: 'Warehouse Brazil 1',
        temperature: 29,
        humidity: 90,
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue({
        id: 4,
        ...dto,
        measuredAt: new Date(),
      });

      await service.create(dto);

      expect(mockPrisma.alert.create).toHaveBeenCalledWith({
        data: {
          type: 'HUMIDITY',
          message: expect.stringContaining('Humidité hors seuil'),
        },
      });
    });

    it('should create alerts for both temperature and humidity when both are out of range', async () => {
      const dto = {
        warehouseName: 'Warehouse Brazil 1',
        temperature: 40,
        humidity: 95,
      };

      mockPrisma.sensorMeasurement.create.mockResolvedValue({
        id: 5,
        ...dto,
        measuredAt: new Date(),
      });

      await service.create(dto);

      expect(mockPrisma.alert.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it('should return all measurements ordered by measuredAt desc', async () => {
      const measurements = [
        {
          id: 2,
          warehouseName: 'Warehouse Brazil 1',
          temperature: 30,
          humidity: 56,
          measuredAt: new Date('2024-06-15T10:00:00.000Z'),
        },
        {
          id: 1,
          warehouseName: 'Warehouse Brazil 1',
          temperature: 29,
          humidity: 55,
          measuredAt: new Date('2024-06-01T10:00:00.000Z'),
        },
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
        {
          id: 1,
          warehouseName: 'Warehouse Brazil 1',
          temperature: 29,
          humidity: 55,
          measuredAt: new Date('2024-06-01T10:00:00.000Z'),
        },
      ];

      mockPrisma.sensorMeasurement.findMany.mockResolvedValue(measurements);

      const result = await service.findByWarehouse('Warehouse Brazil 1');

      expect(mockPrisma.sensorMeasurement.findMany).toHaveBeenCalledWith({
        where: { warehouseName: 'Warehouse Brazil 1' },
        orderBy: { measuredAt: 'desc' },
      });
      expect(result).toEqual(measurements);
    });
  });
});