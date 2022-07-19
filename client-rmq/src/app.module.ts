import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './database/redis/redis.module';
import { PositionModule } from './position/position.module';
// import { SequelizeModule } from '@nestjs/sequelize';
import { Position } from './position/entities/position.entity';
import { PositionService } from './position/position.service';
import { EventModule } from './event/event.module';
import { EventService } from './event/event.service';
import { Event } from './event/entities/event.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'packages',
          type: 'topic',
        },
      ],
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'treatment',
      autoLoadModels: true,
      synchronize: true,
    }),
    RedisModule,
    PositionModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService, PositionService, EventService],
})
export class AppModule { }
