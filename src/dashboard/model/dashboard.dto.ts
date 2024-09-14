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

export interface ProductorsDashboardDataOutputDto {
  totalProductors: number;
  totalProductorsArea: number;
  totalProductorsByState: ProductorTotalsByStateOutputDto;
  totalAreas: ProductorTotalsByAreaUseOutputDto;
  totalProductorsByFarmCrop: TotalProductorsByFarmCropOutputDto;
}
