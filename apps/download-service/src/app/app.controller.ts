import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { DownloadImageDto } from '@scale-hoster/common';

/**
 * Controller for handling image download requests.
 */
@Controller('download')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Accepts a download URL and creates an async download task.
   * @param downloadImageDto - DTO containing the download URL.
   * @returns task id and status.
   */
  @Post()
  async createDownloadTask(@Body() downloadImageDto: DownloadImageDto) {
    return this.appService.createDownloadTask(downloadImageDto);
  }
}
