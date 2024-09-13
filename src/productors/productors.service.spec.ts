import { Test, TestingModule } from '@nestjs/testing';
import { ProductorsService } from './productors.service';
import { DatabaseService } from '../database/database.service';
import { ProductorsFactory } from './productors.factory';
import { ProductorsInputDto } from './model/productors.dto';
import { faker } from '@faker-js/faker';

describe('ProductorsService', () => {
  let service: ProductorsService;
  let dbService: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, ProductorsService],
    }).compile();

    service = await module.resolve(ProductorsService);
    dbService = await module.resolve(DatabaseService);
  });

  beforeEach(async () => {
    await dbService.agriculturalProductor.deleteMany();
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

    const productorOnDb = await dbService.agriculturalProductor
      .findUniqueOrThrow({
        where: {
          id: Number(productorCreate.id),
        },
      })
      .catch((e) => e);

    expect(productorOnDb).not.toBeInstanceOf(Error);
    expect(productorOnDb).toMatchObject(productorInput);
  });

  it('should return a registered productor with success', async () => {
    const productorInput = ProductorsFactory.generateProductorDbInput();
    const productorOnDb = await dbService.agriculturalProductor.create({
      data: productorInput,
    });
    const productorFromService = await service
      .getOne(productorOnDb.id)
      .catch((e) => e);
    expect(productorFromService).not.toBeInstanceOf(Error);
    expect(productorFromService).toMatchObject(productorOnDb);
  });

  it('should raise an error when trying to get an unexistent productor', async () => {
    const response = await service.getOne(0).catch((e) => e);
    expect(response).toBeInstanceOf(Error);
    expect(response.name).toBe('NotFoundException');
    expect(response.message).toBe(`Not found a productor with ID [0]`);
  });

  it('should update an agricultural productor with success', async () => {
    const productorInput = ProductorsFactory.generateProductorInput();
    const productorCreate = await service
      .create(productorInput)
      .catch((e) => e);
    expect(productorCreate).not.toBeInstanceOf(Error);
    expect(productorCreate).toHaveProperty('id');
    expect(productorCreate.id).not.toBeNaN();

    const productorOnDb = await dbService.agriculturalProductor
      .findUniqueOrThrow({
        where: {
          id: Number(productorCreate.id),
        },
      })
      .catch((e) => e);

    expect(productorOnDb).not.toBeInstanceOf(Error);
    expect(productorOnDb).toMatchObject(productorInput);

    const updatedProductorInput: Partial<ProductorsInputDto> = {
      farmName: faker.company.name(),
    };

    const productorUpdate = await service
      .update(productorOnDb.id, updatedProductorInput)
      .catch((e) => e);
    expect(productorUpdate).not.toBeInstanceOf(Error);

    const updatedProductorOnDb = await dbService.agriculturalProductor
      .findUniqueOrThrow({
        where: {
          id: Number(productorOnDb.id),
        },
      })
      .catch((e) => e);

    expect(updatedProductorOnDb).not.toBeInstanceOf(Error);
    expect(updatedProductorOnDb).not.toMatchObject(productorOnDb);
    expect(updatedProductorOnDb).toMatchObject(updatedProductorInput);
  });

  it('should delete a productor with success', async () => {
    const productorInput = ProductorsFactory.generateProductorDbInput();
    const productorCreate = await dbService.agriculturalProductor.create({
      data: productorInput,
    });
    const deleteRes = await service.delete(productorCreate.id).catch((e) => e);
    expect(deleteRes).not.toBeInstanceOf(Error);

    const productorOnDb = await dbService.agriculturalProductor
      .findUniqueOrThrow({
        where: {
          id: Number(productorCreate.id),
        },
      })
      .catch((e) => e);

    expect(productorOnDb).toBeInstanceOf(Error);
    expect(productorOnDb.name).toBe('NotFoundError');
    expect(productorOnDb.code).toBe('P2025');
  });

  afterAll(async () => {
    await dbService.$disconnect();
  });
});
