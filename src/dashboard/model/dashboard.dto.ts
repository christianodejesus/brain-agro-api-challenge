import { ApiProperty } from '@nestjs/swagger';

export interface TotalProductorsOutputDto {
  total: number;
}

export interface TotalProductorsAreaOutputDto {
  totalArea: number;
}

export interface ProductorTotalsByStateOutputDto {
  [index: string]: {
    totalProductors: number;
    totalArea: number;
  };
}

export class ProductorTotalsByAreaUseOutputDto {
  @ApiProperty()
  totalUsefulArea: number;

  @ApiProperty()
  totalForestArea: number;
}

export interface TotalProductorsByFarmCropOutputDto {
  [index: string]: number;
}

export class ProductorsDashboardDataOutputDto {
  @ApiProperty()
  totalProductors: number;

  @ApiProperty()
  totalProductorsArea: number;

  @ApiProperty({
    example: {
      'Rio de Janeiro': {
        totalProductors: 0,
        totalArea: 0,
      },
      'São Paulo': {
        totalProductors: 0,
        totalArea: 0,
      },
    },
  })
  totalProductorsByState: ProductorTotalsByStateOutputDto;

  @ApiProperty()
  totalAreas: ProductorTotalsByAreaUseOutputDto;

  @ApiProperty({
    example: {
      Milho: 0,
      Arroz: 0,
    },
  })
  totalProductorsByFarmCrop: TotalProductorsByFarmCropOutputDto;
}
