import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'redis-om';
import { discovery } from './discover';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { PositionService } from './position/position.service';
import { ConsumeMessage } from 'amqplib';
@Injectable()
export class AppService {
  private count = 1;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Client,
    private positionService: PositionService,
  ) {}

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
    const { tracker_model, cmd, data } = msg.data;
    const convertedData = discovery(tracker_model, cmd, data);

    if (convertedData)
      const id = await this.positionService.createOrUprateLastPosition(
        convertedData as unknown as CreatePositionDto,
      );
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
