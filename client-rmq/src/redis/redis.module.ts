import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { Client } from 'redis-om';

@Module({
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        url: 'redis://localhost:6379',
      },
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redis = createClient({ url: 'redis://localhost:6379' });
        await redis.connect();
        const client = await new Client().use(redis);
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule { }
