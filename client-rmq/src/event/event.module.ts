import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from 'redis-om';
import { RedisModule } from 'src/database/redis/redis.module';
import { eventTemporarySchema } from './entities/event-cache.entity';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Module({
  imports: [RedisModule, SequelizeModule.forFeature([Event])],
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
  exports: ['REDIS_EVENT', SequelizeModule],
})
export class EventModule { }
