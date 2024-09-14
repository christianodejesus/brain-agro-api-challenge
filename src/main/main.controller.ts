import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

class HealthOutputDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  startedAt: string;
}

@Controller()
export class MainController {
  private startDate = new Date().toISOString();

  constructor() {}

  @ApiOkResponse({
    description: 'Api health data',
    type: HealthOutputDto,
  })
  @Get('/health')
  gethealth(): HealthOutputDto {
    return {
      message: `I'm health`,
      startedAt: this.startDate,
    };
  }
}
