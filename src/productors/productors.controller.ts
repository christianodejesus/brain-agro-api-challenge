import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductorsService } from './productors.service';
import { ProductorsInputDto } from './model/productors.dto';
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
    return data;
  }
}
