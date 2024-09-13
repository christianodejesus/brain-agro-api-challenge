import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AgriculturalProductor } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ProductorsInputDto } from './model/productors.dto';

@Injectable()
export class ProductorsService {
  constructor(private readonly dbService: DatabaseService) {}

  public async getOne(id: number): Promise<AgriculturalProductor> {
    Logger.log(
      `retrieving productor's data for ID [${id}]`,
      ProductorsService.name,
    );

    const productor = await this.dbService.agriculturalProductor.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!productor) {
      Logger.warn(`Not found a productor with ID [${id}]`);
      throw new NotFoundException(`Not found a productor with ID [${id}]`);
    }

    return productor;
  }

  public async create(
    data: ProductorsInputDto,
  ): Promise<AgriculturalProductor> {
    Logger.log(`registering productor's data`, ProductorsService.name);

    try {
      return await this.dbService.agriculturalProductor.create({
        data,
      });
    } catch (e) {
      Logger.error(
        `Error on trying to register the productor: [${e.message}]`,
        ProductorsService.name,
      );
      throw new BadRequestException(
        `Error on trying to register the productor`,
      );
    }
  }

  public async update(
    id: number,
    data: Partial<ProductorsInputDto>,
  ): Promise<AgriculturalProductor> {
    Logger.log(`updating productor's data`, ProductorsService.name);

    try {
      return await this.dbService.agriculturalProductor.update({
        where: {
          id,
        },
        data,
      });
    } catch (e) {
      Logger.error(
        `Error on trying to update the productor: [${e.message}]`,
        ProductorsService.name,
      );
      throw new BadRequestException(`Error on trying to update the productor`);
    }
  }

  public async delete(id: number): Promise<void> {
    Logger.log(
      `deleting productor's data for ID [${id}]`,
      ProductorsService.name,
    );

    const productor = await this.dbService.agriculturalProductor.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!productor) {
      Logger.warn(`Not found a productor with ID [${id}]`);
      throw new NotFoundException(`Not found a productor with ID [${id}]`);
    }

    await this.dbService.agriculturalProductor.delete({
      where: {
        id: Number(id),
      },
    });

    Logger.log(
      `productor with ID [${id}] deleted with success`,
      ProductorsService.name,
    );
  }
}
