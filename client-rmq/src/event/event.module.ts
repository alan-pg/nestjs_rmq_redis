import { Module } from '@nestjs/common';
import { Client } from 'redis-om';
import { RedisModule } from 'src/database/redis/redis.module';
import { eventTemporarySchema } from './entities/event-cache.entity';
import { EventService } from './event.service';

@Module({
  imports: [RedisModule],
  providers: [
    EventService,
    {
      inject: ['REDIS_CLIENT'],
      provide: 'REDIS_EVENT',
      useFactory: async (client: Client) => {
        const repository = client.fetchRepository(eventTemporarySchema);
        await repository.createIndex();
        return repository;
      },
    },
  ],
  exports: ['REDIS_EVENT'],
})
export class EventModule { }
