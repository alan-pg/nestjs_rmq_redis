import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

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
    const packages = [
      '*ET,354522180040052,HB,A,160713,130A27,80CF080A,818C4C6A,0ED8,0A28,40800000,12,100,00,000A7A13,2,2406021317,0000000000,0000,13.48,14#',
      '*ET,354522186461682,CC,0.0,A,160713,130A28,80D24A2E,819002DA,0190,7B0C,00000000,11,100,00,00001A9C,8,12.67,10#',
      '*ET,354522182225867,AM,V,160713,130A26,80D09CF6,818DA3D4,0000,0000,00000008,8,100,00,000281E9,0,12.48,0#',
      '*ET,354522180114956,HB,A,160713,130A1F,80D0FE61,818CDA04,07D0,3840,40800000,10,100,00,00090346,13,0602131911,0000000000,0000,13.54,15#',
      '*ET,354522182157441,AM,V,160713,13091D,80D1090C,818C5806,0000,0000,00800000,99,100,00,0000D3D1,0,11.69,0#',
      '*ET,354522182157441,CC,0.0,A,160713,120513,80D1090C,818C5806,0000,5EEC,00000000,8,100,00,0000D3D1,18,12.82,11#',
      '*ET,354522183563241,HB,V,160713,130A30,80CF5058,818C5C7A,0000,0000,00000000,8,100,00,000037AF,0,0000000000,0000000000,0000,9.38,0#',
      '*ET,354522183579528,AM,A,160713,130F0D,80CF3C30,8191F8D8,0000,0000,00800000,23,100,00,0007C9D8,391,12.86,0#',
      '*ET,354522183767974,AM,A,160713,130D35,80D18BAC,818F7894,0000,0000,00800000,8,100,00,0000830A,22,12.49,0#',
      '*ET,354522183767974,AM,A,160713,130E29,80D18CCE,818F7C9A,0C1C,82DC,40800001,5,100,00,0000830D,27,14.35,13#',
    ];
    for (let i = 0; i < 1; i++) {
      const data = {
        id: '07f1b27f-d4c3-4a5a-8646-157a753b8888',
        cmd: 'HB',
        data: packages[0],
        device_id: null,
        complement: null,
        date: '2022-07-13 18:04:18',
        tracker_model: 'E3',
        created_at: '2022-09-13 18:04:18',
        updated_at: '2022-09-13 18:04:18',
      };
      this.amqpConnection.publish(
        'packages',
        'package-position-route',
        {
          data,
        },
        {
          headers: {
            'x-retry': 1,
            'x-retry-limit': 5,
            'x-delay': 100000,
          },
        },
      );
      //imei++;
    }
    return 'position';
  }
  /* 
  @Cron('* * * * * *')
  handleCron() {
    for (let i = 0; i < 1000; i++) {
      const data = {
        id: '07f1b27f-d4c3-4a5a-8646-157a753b8888',
        cmd: 'HB',
        data: '*ET,354522183685853,HB,A,16070D,120410,80D16D65,818DEDCE,0898,22C4,40800000,7,100,00,00012E40,49,0619301407,0000000000,0000,13.80,13#',
        device_id: null,
        complement: null,
        date: '2022-07-13 18:04:18',
        tracker_model: 'E3',
        attempts: 0,
        created_at: '2022-07-13 18:04:18',
        updated_at: '2022-07-13 18:04:18',
      };
      this.amqpConnection.publish('packages', 'package-position-route', {
        data,
      });
    }
    console.log('feito');
  } */
}
