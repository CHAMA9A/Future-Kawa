import { Test, TestingModule } from '@nestjs/testing';
import { LotsService } from './lots.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LotsService (Colombia)', () => {
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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a coffee lot with CONFORME status', async () => {
      const dto = {
        lotCode: 'COL-2024-001',
        country: 'Colombia',
        warehouseName: 'Warehouse Colombia 1',
        storageDate: '2024-06-01T00:00:00.000Z',
      };

      const expected = {
        id: 1,
        lotCode: 'COL-2024-001',
        country: 'Colombia',
        warehouseName: 'Warehouse Colombia 1',
        storageDate: new Date('2024-06-01T00:00:00.000Z'),
        status: 'CONFORME',
        createdAt: new Date(),
      };

      mockPrisma.coffeeLot.create.mockResolvedValue(expected);
      const result = await service.create(dto);

      expect(mockPrisma.coffeeLot.create).toHaveBeenCalledWith({
        data: {
          lotCode: 'COL-2024-001',
          country: 'Colombia',
          warehouseName: 'Warehouse Colombia 1',
          storageDate: new Date('2024-06-01T00:00:00.000Z'),
          status: 'CONFORME',
        },
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all lots ordered by createdAt desc', async () => {
      const lots = [
        { id: 2, lotCode: 'COL-2024-002', country: 'Colombia', warehouseName: 'Warehouse Colombia 1', storageDate: new Date('2024-06-15'), status: 'CONFORME', createdAt: new Date('2024-06-15') },
        { id: 1, lotCode: 'COL-2024-001', country: 'Colombia', warehouseName: 'Warehouse Colombia 1', storageDate: new Date('2024-06-01'), status: 'CONFORME', createdAt: new Date('2024-06-01') },
      ];

      mockPrisma.coffeeLot.findMany.mockResolvedValue(lots);
      const result = await service.findAll();

      expect(mockPrisma.coffeeLot.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('findFifo', () => {
    it('should return lots ordered by storageDate asc (oldest first)', async () => {
      const lots = [
        { id: 1, lotCode: 'COL-2024-001', country: 'Colombia', warehouseName: 'Warehouse Colombia 1', storageDate: new Date('2024-01-01'), status: 'CONFORME', createdAt: new Date('2024-01-01') },
        { id: 2, lotCode: 'COL-2024-002', country: 'Colombia', warehouseName: 'Warehouse Colombia 1', storageDate: new Date('2024-06-01'), status: 'CONFORME', createdAt: new Date('2024-06-01') },
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