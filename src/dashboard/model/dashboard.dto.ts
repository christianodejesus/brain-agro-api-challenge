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

export interface ProductorTotalsByAreaUseOutputDto {
  totalUsefulArea: number;
  totalForestArea: number;
}

export interface TotalProductorsByFarmCropOutputDto {
  [index: string]: number;
}
