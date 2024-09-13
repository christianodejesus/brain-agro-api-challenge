import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as cpf from '@fnando/cpf';
import { ProductorsInputDto } from './model/productors.dto';

export class ProductorsFactory {
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
    const farmForestArea = faker.number.int(150),
      farmUsefulArea = faker.number.int(150),
      minTotalArea = farmForestArea + farmUsefulArea;

    return {
      documentNumber: cpf.generate(),
      productorName: faker.person.fullName(),
      farmName: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state(),
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
