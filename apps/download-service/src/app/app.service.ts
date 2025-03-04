import { Inject, Injectable } from '@nestjs/common';
import { DownloadImageDto } from '@scale-hoster/common';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';

/**
 * Service to manage download tasks.
 */
@Injectable()
export class AppService {

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  /**
   * Creates a download task.
   * @param dto - DTO with the image download URL.
   * @returns The task id and pending status.
   */
  async createDownloadTask(dto: DownloadImageDto): Promise<any> {
    const taskId = uuidv4();
    // Save task in local DB using TypeORM (omitted for brevity – see entity below)
    // Publish event to start download process
    await this.redisClient.emit('download_task_created', { taskId, downloadUrl: dto.downloadUrl });
    return { taskId, status: 'pending' };
  }
}
