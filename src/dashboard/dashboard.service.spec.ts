import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { DatabaseService } from '../database/database.service';
import { faker } from '@faker-js/faker';
import {
  ProductorTotalsByAreaUseOutputDto,
  ProductorTotalsByStateOutputDto,
  TotalProductorsByFarmCropOutputDto,
} from './model/dashboard.dto';

describe('DashboardService (mocked)', () => {
  let service: DashboardService;

  class MockedDbService {
    agriculturalProductor = {
      async count(): Promise<any> {},
      async aggregate(): Promise<any> {},
      async groupBy(): Promise<any> {},
    };

    productorsByFarmCrop = {
      async findMany(): Promise<any> {},
    };
  }

  const dbService = new MockedDbService();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, DashboardService],
    })
      .overrideProvider(DatabaseService)
      .useValue(dbService)
      .compile();

    service = module.get(DashboardService);
  });

  beforeEach(async () => {
    dbService.agriculturalProductor = {
      async count(): Promise<any> {},
      async aggregate(): Promise<any> {},
      async groupBy(): Promise<any> {},
    };
    dbService.productorsByFarmCrop = {
      async findMany(): Promise<any> {},
    };
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the total number of farms (productors) registered', async () => {
    const mockedCount = 28;
    dbService.agriculturalProductor.count = async () => mockedCount;

    const totalProductors = await service.getTotalProductors().catch((e) => e);
    expect(totalProductors).not.toBeInstanceOf(Error);
    expect(totalProductors.total).toBeDefined();
    expect(totalProductors.total).not.toBeNaN();
    expect(totalProductors.total).toBe(mockedCount);
  });

  it('should return the total area of registered farms (productors)', async () => {
    const mockedTotalArea = 580;
    dbService.agriculturalProductor.aggregate = async () => {
      return {
        _sum: {
          farmTotalArea: mockedTotalArea,
        },
      };
    };

    const totalProductorsArea = await service
      .getTotalProductorsArea()
      .catch((e) => e);
    expect(totalProductorsArea).not.toBeInstanceOf(Error);
    expect(totalProductorsArea.totalArea).toBeDefined();
    expect(totalProductorsArea.totalArea).not.toBeNaN();
    expect(totalProductorsArea.totalArea).toBe(mockedTotalArea);
  });

  it('should return the total area and quantity of productors by grouped by state', async () => {
    const mockedGroupByData: ProductorTotalsByStateOutputDto = {
      [faker.location.county()]: {
        totalProductors: 10,
        totalArea: 5140,
      },
      [faker.location.county()]: {
        totalProductors: 5,
        totalArea: 2350,
      },
      [faker.location.county()]: {
        totalProductors: 2,
        totalArea: 1690,
      },
    };

    dbService.agriculturalProductor.groupBy = async () => {
      return Object.entries(mockedGroupByData).map(([state, totals]) => ({
        state,
        _count: {
          _all: totals.totalProductors,
        },
        _sum: {
          farmTotalArea: totals.totalArea,
        },
      }));
    };

    const productorTotals = await service
      .getTotalAreaAndProductorsByState()
      .catch((e) => e);
    expect(productorTotals).not.toBeInstanceOf(Error);
    expect(productorTotals).toBeDefined();
    expect(productorTotals).toMatchObject(mockedGroupByData);
  });

  it('should return the total area of productors by area use', async () => {
    const mockedGroupByData: ProductorTotalsByAreaUseOutputDto = {
      totalForestArea: 5874,
      totalUsefulArea: 7885,
    };

    dbService.agriculturalProductor.aggregate = async () => {
      return {
        _sum: {
          farmForestArea: mockedGroupByData.totalForestArea,
          farmUsefulArea: mockedGroupByData.totalUsefulArea,
        },
      };
    };

    const productorTotalsByArea = await service
      .getTotalAreaByAreaUse()
      .catch((e) => e);
    expect(productorTotalsByArea).not.toBeInstanceOf(Error);
    expect(productorTotalsByArea).toBeDefined();
    expect(productorTotalsByArea).toMatchObject(mockedGroupByData);
  });

  it('should return the total of productors by farmCrop', async () => {
    const mockedGroupByData: TotalProductorsByFarmCropOutputDto = {
      ['Cana de Açúcar']: 10,
      ['Milho']: 10,
      Soja: 9,
      ['Café']: 10,
      ['Algodão']: 9,
    };

    dbService.productorsByFarmCrop.findMany = async () => {
      return Object.entries(mockedGroupByData).map(
        ([farmCrop, totalProductors]) => ({
          farmCrop,
          totalProductors,
        }),
      );
    };

    const productorTotalsByFarmCrop = await service
      .getTotalProductorsByFarmCrop()
      .catch((e) => e);
    expect(productorTotalsByFarmCrop).not.toBeInstanceOf(Error);
    expect(productorTotalsByFarmCrop).toBeDefined();
    expect(productorTotalsByFarmCrop).toMatchObject(mockedGroupByData);
  });
});
