import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductorsFactory } from '../src/productors/productors.factory';
import { DatabaseService } from '../src/database/database.service';
import { TestHelper } from './utils/test.helper';
import {
  ProductorsDashboardDataOutputDto,
  TotalProductorsByFarmCropOutputDto,
} from '../src/dashboard/model/dashboard.dto';
import { faker } from '@faker-js/faker';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let dbService: DatabaseService;

  beforeAll(async () => {
    const testModule = await TestHelper.initAppTestModule();
    app = await TestHelper.setupTestApp(testModule);
    dbService = testModule.get(DatabaseService);

    await app.init();
  });

  beforeEach(async () => {
    await dbService.agriculturalProductor.deleteMany();
  });

  describe('GET /dashboard', () => {
    it('should return a registered productor with success', async () => {
      const state1 = faker.location.county(),
        state2 = faker.location.county(),
        state3 = faker.location.county();

      const productorsToCreate = [
        ProductorsFactory.generateProductorDbInput({
          state: state1,
          farmCrops: ['Soja', 'Milho'],
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state1,
          farmCrops: ['Algodão', 'Café'],
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state1,
          farmCrops: ['Cana de Açúcar'],
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state1,
          farmCrops: ['Soja', 'Café'],
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state1,
          farmCrops: ['Milho'],
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state1,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state2,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
        ProductorsFactory.generateProductorDbInput({
          state: state3,
        }),
      ];

      const createRes = await dbService.agriculturalProductor
        .createMany({
          data: productorsToCreate,
        })
        .catch((e) => e);
      expect(createRes).not.toBeInstanceOf(Error);

      const res = await request(app.getHttpServer())
        .get(`/dashboard`)
        .expect(HttpStatus.OK);

      const data = res.body as ProductorsDashboardDataOutputDto;
      expect(data).toBeDefined();
      expect(data).not.toBeNull();
      expect(data.totalProductors).toBe(productorsToCreate.length);
      expect(data.totalProductorsArea).toBe(
        productorsToCreate.reduce(
          (total, current) => total + current.farmTotalArea,
          0,
        ),
      );
      expect(data.totalAreas).toMatchObject({
        totalForestArea: productorsToCreate.reduce(
          (total, current) => total + current.farmForestArea,
          0,
        ),
        totalUsefulArea: productorsToCreate.reduce(
          (total, current) => total + current.farmUsefulArea,
          0,
        ),
      });
      const productorsInState1 = productorsToCreate.filter(
        (prd) => prd.state === state1,
      );
      const productorsInState2 = productorsToCreate.filter(
        (prd) => prd.state === state2,
      );
      const productorsInState3 = productorsToCreate.filter(
        (prd) => prd.state === state3,
      );
      expect(data.totalProductorsByState).toMatchObject({
        [state1]: {
          totalProductors: productorsInState1.length,
          totalArea: productorsInState1.reduce(
            (total, current) => total + current.farmTotalArea,
            0,
          ),
        },
        [state2]: {
          totalProductors: productorsInState2.length,
          totalArea: productorsInState2.reduce(
            (total, current) => total + current.farmTotalArea,
            0,
          ),
        },
        [state3]: {
          totalProductors: productorsInState3.length,
          totalArea: productorsInState3.reduce(
            (total, current) => total + current.farmTotalArea,
            0,
          ),
        },
      });

      const farmCrops = ['Soja', 'Milho', 'Algodão', 'Café', 'Cana de Açúcar'];
      const expectedProductorsByFarmCrop: TotalProductorsByFarmCropOutputDto =
        {};
      farmCrops.forEach((crop) => {
        expectedProductorsByFarmCrop[crop] = productorsToCreate.filter((prd) =>
          (prd.farmCrops as string[]).includes(crop),
        ).length;
      });
      expect(data.totalProductorsByFarmCrop).toMatchObject(
        expectedProductorsByFarmCrop,
      );
    });
  });

  afterAll(async () => {
    await dbService.agriculturalProductor.deleteMany();
    await dbService.$disconnect();
  });
});
