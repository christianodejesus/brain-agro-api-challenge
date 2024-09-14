import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

class HealthOutputDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  startedAt: string;

  @ApiProperty()
  builtAt: string;

  @ApiProperty()
  commitHash: string;
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
      builtAt: process.env.BUILD_TIME || this.startDate,
      commitHash: process.env.COMMIT_HASH || '',
    };
  }
}
