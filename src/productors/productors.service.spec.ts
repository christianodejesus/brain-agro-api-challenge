import { Test, TestingModule } from '@nestjs/testing';
import { ProductorsService } from './productors.service';
import { DatabaseService } from '../database/database.service';
import { ProductorsFactory } from './productors.factory';
import { faker } from '@faker-js/faker';
import { AgriculturalProductor, Prisma } from '@prisma/client';

describe('ProductorsService (mocked)', () => {
  let service: ProductorsService;

  class MockedDbService {
    static productor?: AgriculturalProductor;

    agriculturalProductor = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async findUnique(options: {
        where: { id: number };
      }): Promise<AgriculturalProductor> {
        return MockedDbService.productor;
      },

      async create(options: {
        data: Prisma.AgriculturalProductorCreateInput;
      }): Promise<AgriculturalProductor> {
        MockedDbService.productor =
          ProductorsFactory.generateAgriculturalProductor(options.data);
        return MockedDbService.productor;
      },

      async update(options: {
        where: { id: number };
        data: Partial<Prisma.AgriculturalProductorCreateInput>;
      }): Promise<AgriculturalProductor> {
        MockedDbService.productor = {
          ...MockedDbService.productor,
          ...(options.data as AgriculturalProductor),
          id: options.where.id,
        };

        return MockedDbService.productor;
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async delete(where: { id: number }) {
        MockedDbService.productor = undefined;
      },
    };
  }

  const dbService = new MockedDbService();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, ProductorsService],
    })
      .overrideProvider(DatabaseService)
      .useValue(dbService)
      .compile();

    service = module.get(ProductorsService);
  });

  beforeEach(async () => {
    MockedDbService.productor = undefined;
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an agricultural productor with success', async () => {
    const productorInput = ProductorsFactory.generateProductorInput();
    const productorCreate = await service
      .create(productorInput)
      .catch((e) => e);
    expect(productorCreate).not.toBeInstanceOf(Error);
    expect(productorCreate).toHaveProperty('id');
    expect(productorCreate.id).not.toBeNaN();

    const productorGet = await service
      .getOne(productorCreate.id)
      .catch((e) => e);

    expect(productorGet).not.toBeInstanceOf(Error);
    expect(productorGet).toMatchObject(productorInput);
  });

  it('should return a registered productor with success', async () => {
    const productorInput = ProductorsFactory.generateAgriculturalProductor();
    MockedDbService.productor = productorInput;

    const productorFromService = await service
      .getOne(productorInput.id)
      .catch((e) => e);

    expect(productorFromService).not.toBeInstanceOf(Error);
    expect(productorFromService).toMatchObject(productorInput);
  });

  it('should raise an error when trying to get an unexistent productor', async () => {
    MockedDbService.productor = undefined;
    const response = await service.getOne(0).catch((e) => e);
    expect(response).toBeInstanceOf(Error);
    expect(response.name).toBe('NotFoundException');
    expect(response.message).toBe(`Not found a productor with ID [0]`);
  });

  it('should update an agricultural productor with success', async () => {
    const agProductor = ProductorsFactory.generateAgriculturalProductor();
    MockedDbService.productor = agProductor;

    const updateData = { farmName: faker.company.name() };

    const productorUpdate = await service
      .update(agProductor.id, updateData)
      .catch((e) => e);
    expect(productorUpdate).not.toBeInstanceOf(Error);

    const updatedProductor = await service
      .getOne(agProductor.id)
      .catch((e) => e);

    expect(updatedProductor).not.toBeInstanceOf(Error);
    expect(updatedProductor).not.toMatchObject(agProductor);
    expect(updatedProductor.farmName).toBe(updateData.farmName);
  });

  it('should delete a productor with success', async () => {
    const agProductor = ProductorsFactory.generateAgriculturalProductor();
    MockedDbService.productor = agProductor;

    const deleteRes = await service.delete(agProductor.id).catch((e) => e);
    expect(deleteRes).not.toBeInstanceOf(Error);

    const productorGet = await service.getOne(agProductor.id).catch((e) => e);

    expect(productorGet).toBeInstanceOf(Error);
    expect(productorGet.name).toBe('NotFoundException');
  });
});
