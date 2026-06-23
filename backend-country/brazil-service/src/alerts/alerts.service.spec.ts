import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AlertsService (Brazil)', () => {
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
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all alerts ordered by createdAt desc', async () => {
      const alerts = [
        {
          id: 2,
          type: 'TEMPERATURE',
          message: 'Température hors seuil',
          status: 'ACTIVE',
          createdAt: new Date('2024-06-15T10:00:00.000Z'),
        },
        {
          id: 1,
          type: 'HUMIDITY',
          message: 'Humidité hors seuil',
          status: 'ACTIVE',
          createdAt: new Date('2024-06-01T10:00:00.000Z'),
        },
      ];

      mockPrisma.alert.findMany.mockResolvedValue(alerts);

      const result = await service.findAll();

      expect(mockPrisma.alert.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(alerts);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no alerts exist', async () => {
      mockPrisma.alert.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('checkExpiredLots', () => {
    it('should detect and flag expired lots', async () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 2);

      const expiredLot = {
        id: 1,
        lotCode: 'BRA-2023-001',
        country: 'Brazil',
        warehouseName: 'Warehouse Brazil 1',
        storageDate: oldDate,
        status: 'CONFORME',
        createdAt: oldDate,
      };

      mockPrisma.coffeeLot.findMany.mockResolvedValue([expiredLot]);
      mockPrisma.coffeeLot.update.mockResolvedValue({ ...expiredLot, status: 'PERIME' });
      mockPrisma.alert.create.mockResolvedValue({
        id: 1,
        type: 'EXPIRED_LOT',
        message: `Lot BRA-2023-001 périmé - stocké depuis le ${oldDate.toISOString().split('T')[0]} (entrepôt : Warehouse Brazil 1)`,
      });

      const result = await service.checkExpiredLots();

      expect(result.expiredLotsFound).toBe(1);
      expect(result.alertsCreated).toBe(1);
      expect(mockPrisma.coffeeLot.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'PERIME' },
      });
      expect(mockPrisma.alert.create).toHaveBeenCalledWith({
        data: {
          type: 'EXPIRED_LOT',
          message: expect.stringContaining('périmé'),
        },
      });
    });

    it('should return zero when no lots are expired', async () => {
      mockPrisma.coffeeLot.findMany.mockResolvedValue([]);

      const result = await service.checkExpiredLots();

      expect(result.expiredLotsFound).toBe(0);
      expect(result.alertsCreated).toBe(0);
      expect(mockPrisma.alert.create).not.toHaveBeenCalled();
    });
  });
});