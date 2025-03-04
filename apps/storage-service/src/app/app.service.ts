import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PublicImageDto } from '@scale-hoster/common';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';

/**
 * Service to store image and generate public URL.
 */
@Injectable()
export class AppService implements OnModuleInit {
  private storagePath = './public/images'; // local storage folder

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  onModuleInit() {
    // Subscribe to metadata_extracted event.
    this.redisClient.emit('metadata_extracted', (data) => this.handleMetadataEvent(data));
  }

  /**
   * Handles the metadata extraction event, stores the image and publishes public URL.
   * @param data - Metadata information.
   */
  async handleMetadataEvent(data: any) {
    // Simulate storing image in file system.
    const imageId = uuidv4();
    const imagePath = `${this.storagePath}/${imageId}.jpg`;
    // Here, you would save the image file to disk (omitted – simulation only)
    // Generate public URL (assuming get-image-service serves files)
    const publicUrl = `http://localhost:3003/image/${imageId}`;
    // Save record to PG (omitted actual TypeORM call for brevity)
    const publicImage: PublicImageDto = { imageId, imagePath, publicUrl, status: 'stored' };
    await this.redisClient.emit('public_image_generated', publicImage);
  }
}
