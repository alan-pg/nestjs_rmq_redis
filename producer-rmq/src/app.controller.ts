import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly amqpConnection: AmqpConnection) { }

  @Get('/event')
  publishEvent(): string {
    const data = {
      id: '1eb3e3e0-2418-4af2-aed9-ccd741ea8521',
      cmd: 'AM',
      data: '*ET,354522182154331,AM,V,16070D,0E2320,80D0A1CE,818C4FC8,0000,6784,00040000,21,100,00,00030344,80,12.49,9#',
      device_id: null,
      complement: null,
      date: '2022-07-13 14:35:33',
      tracker_model: 'E3',
      attempts: 0,
      created_at: '2022-07-13 18:04:18',
      updated_at: '2022-07-13 18:04:18',
    };
    this.amqpConnection.publish('packages', 'package-event-route', {
      data,
    });
    return 'event';
  }

  @Get('/position')
  publishPosition(): string {
    for (let i = 0; i < 1000; i++) {
      const data = {
        id: '07f1b27f-d4c3-4a5a-8646-157a753b8888',
        cmd: 'HB',
        data: `*ET,354522183685853,HB,A,16070D,120410,80D16D65,818DEDCE,0898,22C4,40800000,7,100,00,00012E40,49,0619301407,0000000000,0000,${i},13#`,
        device_id: null,
        complement: null,
        date: '2022-07-13 18:04:18',
        tracker_model: 'E3',
        created_at: '2022-07-13 18:04:18',
        updated_at: '2022-07-13 18:04:18',
      };
      this.amqpConnection.publish('packages', 'package-position-route', {
        data,
      });
    }
    return 'position';
  }

  // @Cron('* * * * * *')
  // handleCron() {
  //   for (let i = 0; i < 1; i++) {
  //     const data = {
  //       id: '07f1b27f-d4c3-4a5a-8646-157a753b8888',
  //       cmd: 'HB',
  //       data: '*ET,354522183685853,HB,A,16070D,120410,80D16D65,818DEDCE,0898,22C4,40800000,7,100,00,00012E40,49,0619301407,0000000000,0000,13.80,13#',
  //       device_id: null,
  //       complement: null,
  //       date: '2022-07-13 18:04:18',
  //       tracker_model: 'E3',
  //       attempts: 0,
  //       created_at: '2022-07-13 18:04:18',
  //       updated_at: '2022-07-13 18:04:18',
  //     };
  //     this.amqpConnection.publish('packages', 'package-position-route', {
  //       data,
  //     });
  //   }
  //   console.log('feito');
  // }
}
