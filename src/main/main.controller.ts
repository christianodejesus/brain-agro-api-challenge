import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  private startDate = new Date().toISOString();

  constructor() {}

  @Get('/health')
  gethealth(): { message: string; startedAt: string } {
    return {
      message: `I'm health`,
      startedAt: this.startDate,
    };
  }
}
