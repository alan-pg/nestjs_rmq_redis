import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './database/redis/redis.module';
import { PositionModule } from './position/position.module';
// import { SequelizeModule } from '@nestjs/sequelize';
import { PositionService } from './position/position.service';
import { EventModule } from './event/event.module';
import { EventService } from './event/event.service';
import { Module } from '@nestjs/common';
import { SequelizeDbModule } from './database/sequelize/sequelize.module';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'packages',
          type: 'topic',
        },
        {
          name: 'DELAY',
          type: 'x-delayed-message',
          options: {
            autoDelete: false,
            durable: true,
            arguments: {
              'x-delayed-type': 'fanout',
              'dead-letter-exchange': 'DLX.DEAD.LETTERS',
            },
          },
        },
      ],
      prefetchCount: 20,
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    RedisModule,
    SequelizeDbModule,
    PositionModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService, PositionService, EventService],
})
export class AppModule {}
