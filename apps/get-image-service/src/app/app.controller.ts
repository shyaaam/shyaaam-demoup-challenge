import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

/**
 * Controller to serve public images.
 */
@Controller('image')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Retrieves the image by its id.
   * @param id - Image identifier.
   * @param res - Express response.
   */
  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const imageRecord = await this.appService.findImageById(id);
    if (imageRecord) {
      // In real scenario, stream file from storage
      return res.status(HttpStatus.OK).json(imageRecord);
    }
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Image not found' });
  }

  @Get('health')
  health() {
    return { status: 'get-image service is running' };
  }
}
