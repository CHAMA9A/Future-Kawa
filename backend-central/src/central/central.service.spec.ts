import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CentralService } from './central.service';
import { of, throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('CentralService', () => {
  let service: CentralService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CentralService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<CentralService>(CentralService);
    httpService = module.get<HttpService>(HttpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCountries', () => {
    it('should return a list of 3 countries', () => {
      const countries = service.getCountries();

      expect(countries).toHaveLength(3);
      expect(countries.map((c) => c.code)).toEqual(['brazil', 'ecuador', 'colombia']);
    });

    it('should include Brazil with correct name', () => {
      const countries = service.getCountries();
      const brazil = countries.find((c) => c.code === 'brazil');

      expect(brazil).toBeDefined();
      expect(brazil!.name).toBe('Brazil');
      expect(brazil!.status).toBe('available');
    });

    it('should include Ecuador with correct name', () => {
      const countries = service.getCountries();
      const ecuador = countries.find((c) => c.code === 'ecuador');

      expect(ecuador).toBeDefined();
      expect(ecuador!.name).toBe('Ecuador');
    });

    it('should include Colombia with correct name', () => {
      const countries = service.getCountries();
      const colombia = countries.find((c) => c.code === 'colombia');

      expect(colombia).toBeDefined();
      expect(colombia!.name).toBe('Colombia');
    });
  });

  describe('getLots', () => {
    it('should fetch lots from Brazil service', async () => {
      const lots = [{ id: 1, lotCode: 'BRA-001' }];
      mockHttpService.get.mockReturnValue(of({ data: lots }));

      const result = await service.getLots('brazil');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/lots',
      );
      expect(result).toEqual(lots);
    });

    it('should fetch lots from Ecuador service', async () => {
      const lots = [{ id: 1, lotCode: 'ECU-001' }];
      mockHttpService.get.mockReturnValue(of({ data: lots }));

      const result = await service.getLots('ecuador');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:3011/api/lots',
      );
      expect(result).toEqual(lots);
    });

    it('should fetch lots from Colombia service', async () => {
      const lots = [{ id: 1, lotCode: 'COL-001' }];
      mockHttpService.get.mockReturnValue(of({ data: lots }));

      const result = await service.getLots('colombia');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:3012/api/lots',
      );
      expect(result).toEqual(lots);
    });

    it('should return unavailable status when Brazil service is unreachable', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Connection refused')));

      const result = await service.getLots('brazil');

      expect(result).toEqual({
        country: 'brazil',
        status: 'unavailable',
        message: 'Country service is unavailable',
      });
    });

    it('should return unavailable status when Ecuador service is unreachable', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Connection refused')));

      const result = await service.getLots('ecuador');

      expect(result).toEqual({
        country: 'ecuador',
        status: 'unavailable',
        message: 'Country service is unavailable',
      });
    });

    it('should return unavailable status when Colombia service is unreachable', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Connection refused')));

      const result = await service.getLots('colombia');

      expect(result).toEqual({
        country: 'colombia',
        status: 'unavailable',
        message: 'Country service is unavailable',
      });
    });
  });

  describe('getAlerts', () => {
    it('should fetch alerts from a country service', async () => {
      const alerts = [{ id: 1, type: 'TEMPERATURE' }];
      mockHttpService.get.mockReturnValue(of({ data: alerts }));

      const result = await service.getAlerts('brazil');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/alerts',
      );
      expect(result).toEqual(alerts);
    });

    it('should return unavailable when service is down', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Timeout')));

      const result = await service.getAlerts('ecuador');

      expect(result).toEqual({
        country: 'ecuador',
        status: 'unavailable',
        message: 'Country service is unavailable',
      });
    });
  });

  describe('getMeasurements', () => {
    it('should fetch measurements from a country service', async () => {
      const measurements = [{ id: 1, temperature: 30 }];
      mockHttpService.get.mockReturnValue(of({ data: measurements }));

      const result = await service.getMeasurements('colombia');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:3012/api/measurements',
      );
      expect(result).toEqual(measurements);
    });
  });

  describe('getLotsFifo', () => {
    it('should fetch FIFO lots from a country service', async () => {
      const fifoLots = [{ id: 1, lotCode: 'BRA-001', storageDate: '2024-01-01' }];
      mockHttpService.get.mockReturnValue(of({ data: fifoLots }));

      const result = await service.getLotsFifo('brazil');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/lots/fifo',
      );
      expect(result).toEqual(fifoLots);
    });
  });

  describe('error handling', () => {
    it('should throw NotFoundException for unknown country', async () => {
      await expect(service.getLots('unknown')).rejects.toThrow(NotFoundException);
      await expect(service.getLots('unknown')).rejects.toThrow(
        'Country "unknown" not found',
      );
    });

    it('should throw NotFoundException for invalid country codes', async () => {
      await expect(service.getLots('')).rejects.toThrow(NotFoundException);
      await expect(service.getAlerts('france')).rejects.toThrow(NotFoundException);
      await expect(service.getMeasurements('')).rejects.toThrow(NotFoundException);
    });
  });
});