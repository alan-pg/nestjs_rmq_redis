import { Module } from '@nestjs/common';
import { Client } from 'redis-om';
import { RedisModule } from 'src/database/redis/redis.module';
import { lastPositionSchema } from './entities/last-position.entity';
import { LastPositionService } from './last-position.service';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [
    LastPositionService,
    {
      inject: ['REDIS_CLIENT'],
      provide: 'REDIS_LAST_POSITION_REPOSITORY',
      useFactory: async (client: Client) => {
        const repository = client.fetchRepository(lastPositionSchema);
        return repository;
      },
    },
  ],
})
export class LastPositionModule { }
