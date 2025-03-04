import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PublicImage } from './entities/public-image.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Service to retrieve public images.
 */
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PublicImage)
    private readonly imageRepo: Repository<PublicImage>,
  ) {}

  /**
   * Finds a public image by id.
   * @param id - Image identifier.
   * @returns The public image record.
   */
  async findImageById(id: string): Promise<PublicImage> {
    return this.imageRepo.findOne({ where: { id } });
  }
}
