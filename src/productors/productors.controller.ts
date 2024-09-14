import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductorsService } from './productors.service';
import {
  ProductorOutputDto,
  ProductorsInputDto,
  ProductorsUpdateInputDto,
} from './model/productors.dto';
import { ProductorInputValidationPipe } from './productor.input.pipe';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('productors')
export class ProductorsController {
  constructor(private readonly productorsService: ProductorsService) {}

  @ApiOkResponse({
    description: `Productor's data`,
    type: ProductorOutputDto,
  })
  @Get(':id')
  async getProductor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductorOutputDto> {
    return await this.productorsService.getOne(id);
  }

  @ApiOkResponse({
    description: `Registered productor's data`,
    type: ProductorOutputDto,
  })
  @Post()
  async createProductor(
    @Body(new ProductorInputValidationPipe()) data: ProductorsInputDto,
  ): Promise<ProductorOutputDto> {
    return await this.productorsService.create(data);
  }

  @ApiOkResponse({
    description: `Productor's updated data`,
    type: ProductorOutputDto,
  })
  @Put(':id')
  async updateProductor(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ProductorInputValidationPipe()) data: ProductorsUpdateInputDto,
  ): Promise<ProductorOutputDto> {
    return await this.productorsService.update(id, data);
  }

  @Delete(':id')
  async deleteProductor(@Param('id', ParseIntPipe) id: number) {
    await this.productorsService.delete(id);
  }
}
