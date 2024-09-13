import { AgriculturalProductor, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as cpf from '@fnando/cpf';
import { ProductorsInputDto } from './model/productors.dto';
import { randomInt } from 'crypto';

export class ProductorsFactory {
  static generateAgriculturalProductor(
    inputData?: Partial<Prisma.AgriculturalProductorCreateInput>,
  ): AgriculturalProductor {
    return {
      id: randomInt(60),
      ...ProductorsFactory.generateProductorInput(
        inputData as ProductorsInputDto,
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static generateProductorDbInput(
    inputData?: Partial<Prisma.AgriculturalProductorCreateInput>,
  ): Prisma.AgriculturalProductorCreateInput {
    return {
      ...ProductorsFactory.generateProductorInput(
        inputData as ProductorsInputDto,
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static generateProductorInput(
    inputData?: Partial<ProductorsInputDto>,
  ): ProductorsInputDto {
    const farmForestArea = faker.number.int({ max: 1000, multipleOf: 5 }),
      farmUsefulArea = faker.number.int({ max: 1000, multipleOf: 5 }),
      minTotalArea = farmForestArea + farmUsefulArea;

    return {
      documentNumber: cpf.generate(),
      productorName: faker.person.fullName(),
      farmName: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.county(),
      farmTotalArea: faker.number.int({
        min: minTotalArea,
        max: minTotalArea * 2,
      }),
      farmForestArea,
      farmUsefulArea,
      farmCrops: ['Soja', 'Milho', 'Algodão', 'Café', 'Cana de Açúcar'],
      ...inputData,
    };
  }
}
