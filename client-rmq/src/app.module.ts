import {
  MessageHandlerErrorBehavior,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
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
import { PackageFailsModule } from './package-fails/package-fails.module';
import { PackageFailsService } from './package-fails/package-fails.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
      exchanges: [
        {
          name: 'packages',
          type: 'topic',
          options: {
            arguments: {
              'x-dead-letter-exchange': 'package-dead-letter',
              'x-dead-letter-routing-key': 'package-position-route',
            },
          },
        },
        {
          name: 'package-dead-letter',
          type: 'topic',
          options: {
            durable: true,
          },
        },
        /* {
          name:'teste',
          type: 
        } */
      ],
      prefetchCount: 20,
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    RedisModule,
    SequelizeDbModule,
    PositionModule,
    EventModule,
    PackageFailsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PositionService, EventService, PackageFailsService],
})
export class AppModule {}
