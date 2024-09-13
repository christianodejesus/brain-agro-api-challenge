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
  ProductorsInputDto,
  ProductorsUpdateInputDto,
} from './model/productors.dto';
import { ProductorInputValidationPipe } from './productor.input.pipe';

@Controller('productors')
export class ProductorsController {
  constructor(private readonly productorsService: ProductorsService) {}

  @Get(':id')
  async getProductor(@Param('id', ParseIntPipe) id: number) {
    return await this.productorsService.getOne(id);
  }

  @Post()
  async createProductor(
    @Body(new ProductorInputValidationPipe()) data: ProductorsInputDto,
  ) {
    return await this.productorsService.create(data);
  }

  @Put(':id')
  async updateProductor(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ProductorInputValidationPipe()) data: ProductorsUpdateInputDto,
  ) {
    return await this.productorsService.update(id, data);
  }

  @Delete(':id')
  async deleteProductor(@Param('id', ParseIntPipe) id: number) {
    await this.productorsService.delete(id);
  }
}
