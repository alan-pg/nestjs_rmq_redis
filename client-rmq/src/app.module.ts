import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './database/redis/redis.module';
import { LastPositionModule } from './position2/last-position.module';
import { LastPositionService } from './position2/last-position.service';
import { PositionModule } from './position/position.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Position } from './position/entities/position.entity';
import { PositionService } from './position/position.service';

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
      models: [Position],
    }),
    RedisModule,
    LastPositionModule,
    PositionModule,
  ],
  controllers: [AppController],
  providers: [AppService, LastPositionService, PositionService],
})
export class AppModule { }
