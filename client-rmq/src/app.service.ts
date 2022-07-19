import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'redis-om';
import { discover } from './discover';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { PositionService } from './position/position.service';
import { ConsumeMessage } from 'amqplib';
import { EventService } from './event/event.service';
@Injectable()
export class AppService {
  private count = 1;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Client,
    private positionService: PositionService,
    private eventService: EventService,
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
  })
  public async pubSubHandlerPosition(
    msg: { data: any },
    amqpMsg: ConsumeMessage,
  ) {
    console.log('nova msg', this.count);
    this.count = this.count + 1;
    const { tracker_model, data } = msg.data;
    const convertedData = discover({ model: tracker_model, data });

    if (convertedData.error) {
      console.log('error', convertedData.errorMessage);
    }

    if (convertedData.ignore) {
      console.log('ignore ');
    }

    if (convertedData.position) {
      console.log('save position');
      const id = await this.positionService.createOrUprateLastPosition(
        convertedData.position as unknown as CreatePositionDto,
      );
    }

    if (convertedData.event) {
      console.log('save event');
      await this.eventService.createEvent(convertedData.event);
    }

    return new Nack();
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
