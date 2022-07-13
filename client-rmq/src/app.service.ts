import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'redis-om';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Client) { }

  async getHello(): Promise<string> {
    const teste0 = await this.redis.set('teste', 'teste');
    console.log(
      '🚀 ~ file: app.service.ts ~ line 11 ~ AppService ~ getHello ~ teste0',
      teste0,
    );
    const teste = await this.redis.get('teste');
    console.log(
      '🚀 ~ file: app.service.ts ~ line 11 ~ AppService ~ getHello ~ teste',
      teste,
    );
    return 'Hello World!';
  }

  @RabbitSubscribe({
    // exchange: 'packages',
    // routingKey: 'package-position-route',
    queue: 'position',
  })
  public async pubSubHandlerPosition(msg: {}) {
    console.log(`Position: ${JSON.stringify(msg)} `);
  }

  @RabbitSubscribe({
    // exchange: 'packages',
    // routingKey: 'package-event-route',
    queue: 'event',
  })
  public async pubSubHandlerEvent(msg: {}) {
    console.log(`Evento: ${JSON.stringify(msg)} `);
  }
}
