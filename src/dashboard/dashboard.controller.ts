import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProductorsDashboardDataOutputDto } from './model/dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOkResponse({
    description: 'Dashboard data',
    type: ProductorsDashboardDataOutputDto,
  })
  @Get()
  async getDashboardData(): Promise<ProductorsDashboardDataOutputDto> {
    return await this.dashboardService.getDashboardData();
  }
}
