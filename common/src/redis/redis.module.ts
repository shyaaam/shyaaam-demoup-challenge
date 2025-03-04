import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Global RedisModule that provides a shared ioredis client instance.
 * This client can be used for publishing and subscribing to events.
 */
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (): Redis => {
        return new Redis('redis://localhost:6379');
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
