import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  ProductorsDashboardDataOutputDto,
  ProductorTotalsByAreaUseOutputDto,
  ProductorTotalsByStateOutputDto,
  TotalProductorsAreaOutputDto,
  TotalProductorsByFarmCropOutputDto,
  TotalProductorsOutputDto,
} from './model/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly dbService: DatabaseService) {}

  async getTotalProductors(): Promise<TotalProductorsOutputDto> {
    const total = await this.dbService.agriculturalProductor.count();

    return {
      total,
    };
  }

  async getTotalProductorsArea(): Promise<TotalProductorsAreaOutputDto> {
    const totalAreaSum = await this.dbService.agriculturalProductor.aggregate({
      _sum: {
        farmTotalArea: true,
      },
    });

    return {
      totalArea: totalAreaSum._sum.farmTotalArea || 0,
    };
  }

  async getTotalAreaAndProductorsByState(): Promise<ProductorTotalsByStateOutputDto> {
    const totals = await this.dbService.agriculturalProductor.groupBy({
      by: ['state'],
      _count: {
        _all: true,
      },
      _sum: {
        farmTotalArea: true,
      },
    });

    const results: ProductorTotalsByStateOutputDto = {};

    totals.forEach(({ state, _sum, _count }) => {
      results[state] = {
        totalArea: _sum.farmTotalArea,
        totalProductors: _count._all,
      };
    });

    return results;
  }

  async getTotalAreaByAreaUse(): Promise<ProductorTotalsByAreaUseOutputDto> {
    const totalAreasSum = await this.dbService.agriculturalProductor.aggregate({
      _sum: {
        farmForestArea: true,
        farmUsefulArea: true,
      },
    });

    return {
      totalForestArea: totalAreasSum._sum.farmForestArea || 0,
      totalUsefulArea: totalAreasSum._sum.farmUsefulArea || 0,
    };
  }

  async getTotalProductorsByFarmCrop(): Promise<TotalProductorsByFarmCropOutputDto> {
    const totals = await this.dbService.productorsByFarmCrop.findMany();

    const results: TotalProductorsByFarmCropOutputDto = {};

    totals.forEach(({ farmCrop, totalProductors }) => {
      results[farmCrop] = Number(totalProductors);
    });

    return results;
  }

  async getDashboardData(): Promise<ProductorsDashboardDataOutputDto> {
    const promises = Promise.all([
      this.getTotalProductors(),
      this.getTotalProductorsArea(),
      this.getTotalAreaAndProductorsByState(),
      this.getTotalAreaByAreaUse(),
      this.getTotalProductorsByFarmCrop(),
    ]);

    const [
      totalProductorsOutputDto,
      totalProductorsAreaOutputDto,
      totalProductorsByState,
      totalAreas,
      totalProductorsByFarmCrop,
    ] = await promises;

    return {
      totalProductors: totalProductorsOutputDto.total,
      totalProductorsArea: totalProductorsAreaOutputDto.totalArea,
      totalProductorsByState,
      totalAreas,
      totalProductorsByFarmCrop,
    };
  }
}
