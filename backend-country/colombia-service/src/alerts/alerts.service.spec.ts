import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AlertsService (Colombia)', () => {
  let service: AlertsService;

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
        { id: 2, type: 'TEMPERATURE', message: 'Test', status: 'ACTIVE', createdAt: new Date('2024-06-15') },
        { id: 1, type: 'HUMIDITY', message: 'Test', status: 'ACTIVE', createdAt: new Date('2024-06-01') },
      ];

      mockPrisma.alert.findMany.mockResolvedValue(alerts);
      const result = await service.findAll();

      expect(mockPrisma.alert.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('checkExpiredLots', () => {
    it('should detect and flag expired lots', async () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 2);

      mockPrisma.coffeeLot.findMany.mockResolvedValue([
        { id: 1, lotCode: 'COL-2023-001', warehouseName: 'Warehouse Colombia 1', storageDate: oldDate, status: 'CONFORME' },
      ]);
      mockPrisma.coffeeLot.update.mockResolvedValue({ status: 'PERIME' });
      mockPrisma.alert.create.mockResolvedValue({ id: 1, type: 'EXPIRED_LOT', message: 'Lot périmé' });

      const result = await service.checkExpiredLots();

      expect(result.expiredLotsFound).toBe(1);
      expect(result.alertsCreated).toBe(1);
    });

    it('should return zero when no lots are expired', async () => {
      mockPrisma.coffeeLot.findMany.mockResolvedValue([]);
      const result = await service.checkExpiredLots();
      expect(result.expiredLotsFound).toBe(0);
      expect(result.alertsCreated).toBe(0);
    });
  });
});