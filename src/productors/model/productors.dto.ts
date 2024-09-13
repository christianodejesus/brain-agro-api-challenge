import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Length,
} from 'class-validator';

export class ProductorsInputDto {
  @IsString()
  @Length(11, 14)
  documentNumber: string;

  @IsString()
  productorName: string;

  @IsString()
  farmName: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsInt()
  farmTotalArea: number;

  @IsInt()
  farmUsefulArea: number;

  @IsInt()
  farmForestArea: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  farmCrops: string[];
}
