import { Test, TestingModule } from '@nestjs/testing';
import { CentralController } from './central.controller';
import { CentralService } from './central.service';

describe('CentralController', () => {
  let controller: CentralController;
  let service: CentralService;

  const mockCentralService = {
    getCountries: jest.fn(),
    getLots: jest.fn(),
    getLotsFifo: jest.fn(),
    getMeasurements: jest.fn(),
    getAlerts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CentralController],
      providers: [
        { provide: CentralService, useValue: mockCentralService },
      ],
    }).compile();

    controller = module.get<CentralController>(CentralController);
    service = module.get<CentralService>(CentralService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /api/central/countries', () => {
    it('should return countries list from service', () => {
      const countries = [
        { code: 'brazil', name: 'Brazil', status: 'available', serviceUrl: 'http://localhost:3001' },
      ];
      mockCentralService.getCountries.mockReturnValue(countries);

      const result = controller.getCountries();

      expect(result).toEqual(countries);
      expect(mockCentralService.getCountries).toHaveBeenCalled();
    });
  });

  describe('GET /api/central/:country/lots', () => {
    it('should call service.getLots with country param', async () => {
      const lots = [{ id: 1, lotCode: 'BRA-001' }];
      mockCentralService.getLots.mockResolvedValue(lots);

      const result = await controller.getLots('brazil');

      expect(result).toEqual(lots);
      expect(mockCentralService.getLots).toHaveBeenCalledWith('brazil');
    });
  });

  describe('GET /api/central/:country/lots/fifo', () => {
    it('should call service.getLotsFifo with country param', async () => {
      const fifoLots = [{ id: 1, lotCode: 'BRA-001', storageDate: '2024-01-01' }];
      mockCentralService.getLotsFifo.mockResolvedValue(fifoLots);

      const result = await controller.getLotsFifo('brazil');

      expect(result).toEqual(fifoLots);
      expect(mockCentralService.getLotsFifo).toHaveBeenCalledWith('brazil');
    });
  });

  describe('GET /api/central/:country/measurements', () => {
    it('should call service.getMeasurements with country param', async () => {
      const measurements = [{ id: 1, temperature: 30 }];
      mockCentralService.getMeasurements.mockResolvedValue(measurements);

      const result = await controller.getMeasurements('ecuador');

      expect(result).toEqual(measurements);
      expect(mockCentralService.getMeasurements).toHaveBeenCalledWith('ecuador');
    });
  });

  describe('GET /api/central/:country/alerts', () => {
    it('should call service.getAlerts with country param', async () => {
      const alerts = [{ id: 1, type: 'TEMPERATURE' }];
      mockCentralService.getAlerts.mockResolvedValue(alerts);

      const result = await controller.getAlerts('colombia');

      expect(result).toEqual(alerts);
      expect(mockCentralService.getAlerts).toHaveBeenCalledWith('colombia');
    });
  });
});