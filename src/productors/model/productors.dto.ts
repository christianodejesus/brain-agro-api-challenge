import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductorsInputDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(11, 14)
  documentNumber: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  productorName: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  farmName: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  city: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  state: string;

  @ApiProperty()
  @IsDefined()
  @IsInt()
  farmTotalArea: number;

  @ApiProperty()
  @IsDefined()
  @IsInt()
  farmUsefulArea: number;

  @ApiProperty()
  @IsDefined()
  @IsInt()
  farmForestArea: number;

  @ApiProperty()
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  farmCrops: string[];
}

export class ProductorOutputDto extends ProductorsInputDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductorsUpdateInputDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  productorName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  farmName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  farmTotalArea?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  farmUsefulArea?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  farmForestArea?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  farmCrops?: string[];
}
