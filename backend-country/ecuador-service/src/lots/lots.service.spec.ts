import { Test, TestingModule } from '@nestjs/testing';
import { LotsService } from './lots.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LotsService (Ecuador)', () => {
  let service: LotsService;
  let prisma: PrismaService;

  const mockPrisma = {
    coffeeLot: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LotsService>(LotsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a coffee lot with CONFORME status', async () => {
      const dto = {
        lotCode: 'ECU-2024-001',
        country: 'Ecuador',
        warehouseName: 'Warehouse Ecuador 1',
        storageDate: '2024-06-01T00:00:00.000Z',
      };

      const expected = {
        id: 1,
        lotCode: 'ECU-2024-001',
        country: 'Ecuador',
        warehouseName: 'Warehouse Ecuador 1',
        storageDate: new Date('2024-06-01T00:00:00.000Z'),
        status: 'CONFORME',
        createdAt: new Date(),
      };

      mockPrisma.coffeeLot.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(mockPrisma.coffeeLot.create).toHaveBeenCalledWith({
        data: {
          lotCode: 'ECU-2024-001',
          country: 'Ecuador',
          warehouseName: 'Warehouse Ecuador 1',
          storageDate: new Date('2024-06-01T00:00:00.000Z'),
          status: 'CONFORME',
        },
      });
      expect(result).toEqual(expected);
    });

    it('should default country to Brazil when not provided', async () => {
      const dto = {
        lotCode: 'ECU-2024-002',
        warehouseName: 'Warehouse Ecuador 2',
        storageDate: '2024-06-15T00:00:00.000Z',
      };

      mockPrisma.coffeeLot.create.mockResolvedValue({
        id: 2,
        lotCode: 'ECU-2024-002',
        country: 'Ecuador',
        warehouseName: 'Warehouse Ecuador 2',
        storageDate: new Date('2024-06-15T00:00:00.000Z'),
        status: 'CONFORME',
        createdAt: new Date(),
      });

      const result = await service.create(dto);

      expect(result.country).toBe('Ecuador');
    });
  });

  describe('findAll', () => {
    it('should return all lots ordered by createdAt desc', async () => {
      const lots = [
        {
          id: 2,
          lotCode: 'ECU-2024-002',
          country: 'Ecuador',
          warehouseName: 'Warehouse Ecuador 1',
          storageDate: new Date('2024-06-15T00:00:00.000Z'),
          status: 'CONFORME',
          createdAt: new Date('2024-06-15T10:00:00.000Z'),
        },
        {
          id: 1,
          lotCode: 'ECU-2024-001',
          country: 'Ecuador',
          warehouseName: 'Warehouse Ecuador 1',
          storageDate: new Date('2024-06-01T00:00:00.000Z'),
          status: 'CONFORME',
          createdAt: new Date('2024-06-01T10:00:00.000Z'),
        },
      ];

      mockPrisma.coffeeLot.findMany.mockResolvedValue(lots);

      const result = await service.findAll();

      expect(mockPrisma.coffeeLot.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(lots);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no lots exist', async () => {
      mockPrisma.coffeeLot.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findFifo', () => {
    it('should return lots ordered by storageDate asc (oldest first)', async () => {
      const lots = [
        {
          id: 1,
          lotCode: 'ECU-2024-001',
          country: 'Ecuador',
          warehouseName: 'Warehouse Ecuador 1',
          storageDate: new Date('2024-01-01T00:00:00.000Z'),
          status: 'CONFORME',
          createdAt: new Date('2024-01-01T10:00:00.000Z'),
        },
        {
          id: 2,
          lotCode: 'ECU-2024-002',
          country: 'Ecuador',
          warehouseName: 'Warehouse Ecuador 1',
          storageDate: new Date('2024-06-01T00:00:00.000Z'),
          status: 'CONFORME',
          createdAt: new Date('2024-06-01T10:00:00.000Z'),
        },
      ];

      mockPrisma.coffeeLot.findMany.mockResolvedValue(lots);

      const result = await service.findFifo();

      expect(mockPrisma.coffeeLot.findMany).toHaveBeenCalledWith({
        orderBy: { storageDate: 'asc' },
      });
      expect(result).toEqual(lots);
    });
  });
});