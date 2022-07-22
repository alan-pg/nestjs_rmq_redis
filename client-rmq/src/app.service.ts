import {
  AssertQueueErrorHandler,
  MessageErrorHandler,
  Nack,
  QueueOptions,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'redis-om';
import { discover } from './discover';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { PositionService } from './position/position.service';
import { EventService } from './event/event.service';
import { PackageFailsService } from './package-fails/package-fails.service';
import { Channel, ConsumeMessage } from 'amqplib';
@Injectable()
export class AppService {
  private count = 1;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Client,
    private positionService: PositionService,
    private eventService: EventService,
    private packageFailService: PackageFailsService,
  ) { }

  async getHello(): Promise<string> {
    const teste0 = await this.positionService.getLpById();
    teste0.forEach((t) => console.log(t.toJSON()));
    return 'Hello World!';
  }

  @RabbitSubscribe({
    exchange: 'packages',
    routingKey: 'package-position-route',
    queue: 'position',
    errorHandler: (channel: Channel, msg: ConsumeMessage, error: any) => {
      console.log('errorHandler');
    },
    queueOptions: {
      deadLetterExchange: 'package-dead-letter',
      deadLetterRoutingKey: 'package-position-route',
      durable: true,
    },
  })
  public async pubSubHandlerPosition(
    msg: { data: any },
    amqpMsg: ConsumeMessage,
  ) {
    console.log('x-death', amqpMsg.properties.headers['x-death']);
    console.log('properties', amqpMsg.properties);
    this.count = this.count + 1;

    const { tracker_model, data, cmd } = msg.data;

    const convertedData = discover({ model: tracker_model, data });

    if (convertedData.error) {
      console.log('error', convertedData.errorMessage);
      const { error } = await this.packageFailService.create({
        data: data,
        reason: convertedData.errorMessage,
        trackerModel: tracker_model,
        cmd,
      });
      if (error) {
        console.log('erro ao salvar packageFailService');
        return new Nack();
      }
      return;
    }

    if (convertedData.ignore) {
      console.log('ignore');
      return;
    }

    if (convertedData.position) {
      console.log('save position');
      const { error } = await this.positionService.createOrUprateLastPosition(
        convertedData.position as unknown as CreatePositionDto,
      );
      if (error) {
        return new Nack();
      }
      return;
    }

    if (convertedData.event) {
      console.log('save event');
      const { error } = await this.eventService.createEvent(
        convertedData.event,
      );
      if (error) {
        return new Nack();
      }
      return;
    }
  }

  // @RabbitSubscribe({
  //   exchange: 'package-dead-letter',
  //   routingKey: 'package-position-route',
  //   queue: 'recovery',
  //   queueOptions: {
  //     deadLetterExchange: 'packages',
  //     deadLetterRoutingKey: 'package-position-route',
  //     durable: true,
  //     messageTtl: 10000,
  //   },
  // })
  // public async pubSubHandlerEvent(
  //   msg: { [key: string]: any },
  //   amqpMsg: ConsumeMessage,
  // ) {
  //   const { data } = msg;
  //   console.log(
  //     '🚀 ~ file: app.service.ts ~ line 98 ~ AppService ~ pubSubHandlerEvent ~ amqpMsg',
  //     amqpMsg.properties,
  //   );

  //   // console.log('msg', msg);
  // }
}
