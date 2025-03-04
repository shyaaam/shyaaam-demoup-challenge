import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ImageMetadataDto } from '@scale-hoster/common';
import Redis from 'ioredis';

/**
 * Service to extract image metadata.
 */
@Injectable()
export class AppService implements OnModuleInit {

  // Initialize Redis client to subscribe to download events.
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}
  
  onModuleInit() {
    // Subscribe to download_task_created event
    this.redisClient.emit('download_task_created', (data) => this.handleDownloadEvent(data));
  }

  /**
   * Simulates metadata extraction and publishes the result.
   * @param data - Data containing taskId and file info.
   */
  async handleDownloadEvent(data: { taskId: string; downloadUrl: string }) {
    // Simulate metadata extraction (in reality, you might use "sharp" or similar)
    const metadata: ImageMetadataDto = {
      taskId: data.taskId,
      format: 'jpeg',
      width: 1024,
      height: 768,
      status: 'extracted',
    };
    // Save metadata to PG (omitted TypeORM saving for brevity)
    // Publish event for storage service
    await this.redisClient.emit('metadata_extracted', metadata);
  }
}
