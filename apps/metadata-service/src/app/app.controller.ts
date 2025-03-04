import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller for metadata service health check.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return { status: 'metadata service is running' };
  }
}
