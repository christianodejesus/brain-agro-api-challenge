import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ProductorsInputDto {
  @IsDefined()
  @IsString()
  @Length(11, 14)
  documentNumber: string;

  @IsDefined()
  @IsString()
  productorName: string;

  @IsDefined()
  @IsString()
  farmName: string;

  @IsDefined()
  @IsString()
  city: string;

  @IsDefined()
  @IsString()
  state: string;

  @IsDefined()
  @IsInt()
  farmTotalArea: number;

  @IsDefined()
  @IsInt()
  farmUsefulArea: number;

  @IsDefined()
  @IsInt()
  farmForestArea: number;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  farmCrops: string[];
}

export class ProductorsUpdateInputDto {
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  productorName?: string;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsInt()
  farmTotalArea?: number;

  @IsOptional()
  @IsInt()
  farmUsefulArea?: number;

  @IsOptional()
  @IsInt()
  farmForestArea?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  farmCrops?: string[];
}
