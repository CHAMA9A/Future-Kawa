import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AlertsService (Ecuador)', () => {
  let service: AlertsService;
  let prisma: PrismaService;

  const mockPrisma = {
    alert: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    coffeeLot: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all alerts ordered by createdAt desc', async () => {
      const alerts = [
        { id: 2, type: 'TEMPERATURE', message: 'Test', status: 'ACTIVE', createdAt: new Date('2024-06-15T10:00:00.000Z') },
        { id: 1, type: 'HUMIDITY', message: 'Test', status: 'ACTIVE', createdAt: new Date('2024-06-01T10:00:00.000Z') },
      ];

      mockPrisma.alert.findMany.mockResolvedValue(alerts);
      const result = await service.findAll();

      expect(mockPrisma.alert.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no alerts', async () => {
      mockPrisma.alert.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('checkExpiredLots', () => {
    it('should detect and flag expired lots', async () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 2);

      mockPrisma.coffeeLot.findMany.mockResolvedValue([
        { id: 1, lotCode: 'ECU-2023-001', warehouseName: 'Warehouse Ecuador 1', storageDate: oldDate, status: 'CONFORME' },
      ]);
      mockPrisma.coffeeLot.update.mockResolvedValue({ status: 'PERIME' });
      mockPrisma.alert.create.mockResolvedValue({ id: 1, type: 'EXPIRED_LOT', message: 'Lot périmé' });

      const result = await service.checkExpiredLots();

      expect(result.expiredLotsFound).toBe(1);
      expect(result.alertsCreated).toBe(1);
      expect(mockPrisma.coffeeLot.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'PERIME' },
      });
    });

    it('should return zero when no lots are expired', async () => {
      mockPrisma.coffeeLot.findMany.mockResolvedValue([]);
      const result = await service.checkExpiredLots();
      expect(result.expiredLotsFound).toBe(0);
      expect(result.alertsCreated).toBe(0);
    });
  });
});