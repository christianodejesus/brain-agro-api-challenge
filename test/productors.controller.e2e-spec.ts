import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductorsFactory } from '../src/productors/productors.factory';
import { DatabaseService } from '../src/database/database.service';
import { AgriculturalProductor } from '@prisma/client';
import {
  ProductorsInputDto,
  ProductorsUpdateInputDto,
} from '../src/productors/model/productors.dto';
import { TestHelper } from './utils/test.helper';
import { faker } from '@faker-js/faker';

describe('ProductorsController (e2e)', () => {
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

  describe('GET /productors/:id', () => {
    it('should return validation error when passing id param with wrong type', async () => {
      const res = await request(app.getHttpServer())
        .get(`/productors/aaa`)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('should return a registered productor with success', async () => {
      const productorInput = ProductorsFactory.generateProductorDbInput();

      const createRes = await dbService.agriculturalProductor
        .create({
          data: productorInput,
        })
        .catch((e) => e);
      expect(createRes).not.toBeInstanceOf(Error);

      const res = await request(app.getHttpServer())
        .get(`/productors/${createRes.id}`)
        .expect(HttpStatus.OK);

      const data = res.body as AgriculturalProductor;
      expect(data.id).toBeDefined();
      expect(data.id).not.toBeNaN();
      expect(data.documentNumber).toBe(productorInput.documentNumber);
      expect(data.productorName).toBe(productorInput.productorName);
      expect(data.farmName).toBe(productorInput.farmName);
      expect(data.city).toBe(productorInput.city);
      expect(data.state).toBe(productorInput.state);
      expect(data.farmTotalArea).toBe(productorInput.farmTotalArea);
      expect(data.farmForestArea).toBe(productorInput.farmForestArea);
      expect(data.farmUsefulArea).toBe(productorInput.farmUsefulArea);
      expect(data.farmCrops).toMatchObject(
        productorInput.farmCrops as string[],
      );
      expect(data.createdAt).toBeDefined();
      expect(data.createdAt).not.toBeNull();
      expect(data.updatedAt).toBeDefined();
      expect(data.updatedAt).not.toBeNull();
    });

    it('should return a not found error when productor not exists', async () => {
      await request(app.getHttpServer())
        .get(`/productors/547`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /productors', () => {
    it('should create a productor with success', async () => {
      const productorInput = ProductorsFactory.generateProductorInput();

      const createRes = await request(app.getHttpServer())
        .post(`/productors`)
        .send(productorInput)
        .expect(HttpStatus.CREATED);

      const data = createRes.body as AgriculturalProductor;
      expect(data.id).toBeDefined();
      expect(data.id).not.toBeNaN();
      expect(data).toMatchObject(productorInput);

      const productorFromDb = await dbService.agriculturalProductor.findUnique({
        where: { id: data.id },
      });
      expect(productorFromDb).toBeDefined();
      expect(productorFromDb).not.toBeNull();
      expect(productorFromDb).toMatchObject(productorInput);
    });

    it('should return validation error when data sent is not correct', async () => {
      // no input sent
      await request(app.getHttpServer())
        .post(`/productors`)
        .expect(HttpStatus.BAD_REQUEST);

      // input missing a field
      const inputMissingField =
        ProductorsFactory.generateProductorInput() as Partial<ProductorsInputDto>;
      delete inputMissingField.farmName;

      await request(app.getHttpServer())
        .post(`/productors`)
        .send(inputMissingField)
        .expect(HttpStatus.BAD_REQUEST);

      // input with wrong field type
      const inputWithWrongField: any =
        ProductorsFactory.generateProductorInput() as Partial<ProductorsInputDto>;
      inputWithWrongField.farmTotalArea = '5a';

      await request(app.getHttpServer())
        .post(`/productors`)
        .send(inputWithWrongField)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return validation error when documentNumber sent is not valid CPF or CNPJ number', async () => {
      // input with invalid CPF
      const invalidCPFInput = ProductorsFactory.generateProductorInput({
        documentNumber: faker.string.numeric(11),
      }) as Partial<ProductorsInputDto>;

      const invalidCPFRes = await request(app.getHttpServer())
        .post(`/productors`)
        .send(invalidCPFInput)
        .expect(HttpStatus.BAD_REQUEST);

      expect(invalidCPFRes.body.message?.length).toBeGreaterThan(0);
      expect(invalidCPFRes.body.message[0]).toBe(
        'documentNumber has an invalid CPF value',
      );

      // input with invalid CNPJ
      const invalidCNPJInput = ProductorsFactory.generateProductorInput({
        documentNumber: faker.string.numeric(14),
      }) as Partial<ProductorsInputDto>;

      const invalidCNPJRes = await request(app.getHttpServer())
        .post(`/productors`)
        .send(invalidCNPJInput)
        .expect(HttpStatus.BAD_REQUEST);

      expect(invalidCNPJRes.body.message?.length).toBeGreaterThan(0);
      expect(invalidCNPJRes.body.message[0]).toBe(
        'documentNumber has an invalid CNPJ value',
      );
    });

    it('should return validation error when farmTotalArea have invalid value', async () => {
      const invalidFarmAreaInput = ProductorsFactory.generateProductorInput({
        farmTotalArea: 1,
      }) as Partial<ProductorsInputDto>;

      const invalidFarmAreaRes = await request(app.getHttpServer())
        .post(`/productors`)
        .send(invalidFarmAreaInput)
        .expect(HttpStatus.BAD_REQUEST);

      expect(invalidFarmAreaRes.body.message?.length).toBeGreaterThan(0);
      expect(invalidFarmAreaRes.body.message[0]).toContain(
        'farmTotalArea value cannot be less than summing',
      );
    });
  });

  describe('PUT /productors/:id', () => {
    it('should update a productor data with success', async () => {
      const originalProductorData =
        ProductorsFactory.generateProductorDbInput();

      const createOnDb = await dbService.agriculturalProductor
        .create({
          data: originalProductorData,
        })
        .catch((e) => e);
      expect(createOnDb).not.toBeInstanceOf(Error);

      const productorUpdateInput: ProductorsUpdateInputDto = {
        city: faker.location.city(),
        state: faker.location.county(),
      };

      const updateResp = await request(app.getHttpServer())
        .put(`/productors/${createOnDb.id}`)
        .send(productorUpdateInput)
        .expect(HttpStatus.OK);

      const respData = updateResp.body as AgriculturalProductor;
      expect(respData).not.toMatchObject(originalProductorData);
      expect(respData.city).not.toBe(originalProductorData.city);
      expect(respData.state).not.toBe(originalProductorData.state);

      const productorFromDb = await dbService.agriculturalProductor.findUnique({
        where: { id: respData.id },
      });
      expect(productorFromDb).toBeDefined();
      expect(productorFromDb).not.toBeNull();
      expect(productorFromDb?.city).not.toBe(originalProductorData.city);
      expect(productorFromDb?.state).not.toBe(originalProductorData.state);
    });

    it('should return validation error when passing id param with wrong type', async () => {
      const res = await request(app.getHttpServer())
        .put(`/productors/aaa`)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('should return validation error when data sent is not correct', async () => {
      const originalProductorData =
        ProductorsFactory.generateProductorDbInput();

      const createOnDb = await dbService.agriculturalProductor
        .create({
          data: originalProductorData,
        })
        .catch((e) => e);
      expect(createOnDb).not.toBeInstanceOf(Error);

      // input with wrong field type
      const inputWithWrongField: any = {
        farmTotalArea: '5a',
      };

      await request(app.getHttpServer())
        .put(`/productors/${createOnDb.id}`)
        .send(inputWithWrongField)
        .expect(HttpStatus.BAD_REQUEST);

      const productorFromDb = await dbService.agriculturalProductor.findUnique({
        where: { id: createOnDb.id },
      });
      expect(productorFromDb).toBeDefined();
      expect(productorFromDb).not.toBeNull();
      expect(productorFromDb).toMatchObject(createOnDb);
    });

    it('should return validation error when documentNumber sent is not valid CPF or CNPJ number', async () => {
      const originalProductorData =
        ProductorsFactory.generateProductorDbInput();

      const createOnDb = await dbService.agriculturalProductor
        .create({
          data: originalProductorData,
        })
        .catch((e) => e);
      expect(createOnDb).not.toBeInstanceOf(Error);

      // input with invalid CPF
      const invalidCPFInput: ProductorsUpdateInputDto = {
        documentNumber: faker.string.numeric(11),
      };

      const invalidCPFRes = await request(app.getHttpServer())
        .put(`/productors/${createOnDb.id}`)
        .send(invalidCPFInput)
        .expect(HttpStatus.BAD_REQUEST);

      expect(invalidCPFRes.body.message?.length).toBeGreaterThan(0);
      expect(invalidCPFRes.body.message[0]).toBe(
        'documentNumber has an invalid CPF value',
      );

      // input with invalid CNPJ
      const invalidCNPJInput: ProductorsUpdateInputDto = {
        documentNumber: faker.string.numeric(14),
      };

      const invalidCNPJRes = await request(app.getHttpServer())
        .put(`/productors/${createOnDb.id}`)
        .send(invalidCNPJInput)
        .expect(HttpStatus.BAD_REQUEST);

      expect(invalidCNPJRes.body.message?.length).toBeGreaterThan(0);
      expect(invalidCNPJRes.body.message[0]).toBe(
        'documentNumber has an invalid CNPJ value',
      );

      const productorFromDb = await dbService.agriculturalProductor.findUnique({
        where: { id: createOnDb.id },
      });
      expect(productorFromDb).toBeDefined();
      expect(productorFromDb).not.toBeNull();
      expect(productorFromDb).toMatchObject(createOnDb);
    });

    it('should return validation error when farmTotalArea have invalid value', async () => {
      const originalProductorData =
        ProductorsFactory.generateProductorDbInput();

      const createOnDb = await dbService.agriculturalProductor
        .create({
          data: originalProductorData,
        })
        .catch((e) => e);
      expect(createOnDb).not.toBeInstanceOf(Error);

      const invalidFarmAreaInput: ProductorsUpdateInputDto = {
        farmTotalArea: 10,
        farmForestArea: 10,
        farmUsefulArea: 5,
      };

      const invalidFarmAreaRes = await request(app.getHttpServer())
        .put(`/productors/${createOnDb.id}`)
        .send(invalidFarmAreaInput)
        .expect(HttpStatus.BAD_REQUEST);

      expect(invalidFarmAreaRes.body.message?.length).toBeGreaterThan(0);
      expect(invalidFarmAreaRes.body.message[0]).toContain(
        'farmTotalArea value cannot be less than summing',
      );
    });
  });

  describe('DELETE /productors/:id', () => {
    it('should delete a productor data with success', async () => {
      const originalProductorData =
        ProductorsFactory.generateProductorDbInput();

      const createOnDb = await dbService.agriculturalProductor
        .create({
          data: originalProductorData,
        })
        .catch((e) => e);
      expect(createOnDb).not.toBeInstanceOf(Error);

      await request(app.getHttpServer())
        .delete(`/productors/${createOnDb.id}`)
        .expect(HttpStatus.OK);

      const productorFromDb = await dbService.agriculturalProductor.findUnique({
        where: { id: createOnDb.id },
      });
      expect(productorFromDb).toBeNull();
    });

    it('should return validation error when passing id param with wrong type', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/productors/aaa`)
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('should return not found error when productor not exists', async () => {
      await request(app.getHttpServer())
        .delete(`/productors/0`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await dbService.agriculturalProductor.deleteMany();
    await dbService.$disconnect();
  });
});
