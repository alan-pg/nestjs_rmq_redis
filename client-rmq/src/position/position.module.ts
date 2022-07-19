import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { Client } from 'redis-om';
import { lastPositionSchema } from './entities/last-position.entity';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    PositionService,
    {
      inject: ['REDIS_CLIENT'],
      provide: 'REDIS_LAST_POSITION',
      useFactory: async (client: Client) => {
        const repository = client.fetchRepository(lastPositionSchema);
        await repository.createIndex();
        return repository;
      },
    },
  ],
  exports: ['REDIS_LAST_POSITION'],
})
export class PositionModule {}
