import {
  MessageErrorHandler,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'redis-om';
import { discover } from './discover';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { PositionService } from './position/position.service';
import { Channel, ConsumeMessage, ConsumeMessageFields } from 'amqplib';
import { EventService } from './event/event.service';
import { PackageFailsService } from './package-fails/package-fails.service';
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
      deadLetterExchange: 'DELAY',
    },
  })
  public async pubSubHandlerPosition(
    msg: { data: any },
    amqpMsg: ConsumeMessage,
  ) {
    console.log('nova msg', this.count);
    this.count = this.count + 1;
    const { tracker_model, data, cmd } = msg.data;
    const convertedData = discover({ model: tracker_model, data });

    if (convertedData.error) {
      console.log('error', convertedData.errorMessage);
      const { error } = await this.packageFailService.create({
        data: data,
        date: new Date(),
        reason: convertedData.errorMessage,
        trackerModel: tracker_model,
        cmd,
      });
      if (error) {
        console.log('erro ao salvar packageFailService');
      }
    }

    if (convertedData.ignore) {
      console.log('ignore nack()');
      return new Nack();
    }

    if (convertedData.position) {
      console.log('save position');
      const { error } = await this.positionService.createOrUprateLastPosition(
        convertedData.position as unknown as CreatePositionDto,
      );
      if (error) {
        console.log('position nack()');
        return new Nack();
      }
    }

    if (convertedData.event) {
      console.log('save event');
      await this.eventService.createEvent(convertedData.event);
    }
  }

  @RabbitSubscribe({
    // exchange: 'packages',
    // routingKey: 'package-event-route',
    queue: 'event',
  })
  public async pubSubHandlerEvent(msg: { [key: string]: any }) {
    const { data } = msg;
    console.log(
      '🚀 ~ file: app.service.ts ~ line 39 ~ AppService ~ pubSubHandlerEvent ~ data',
      data,
    );
    // console.log('msg', msg);
  }
}
