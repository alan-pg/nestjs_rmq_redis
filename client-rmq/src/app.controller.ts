import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventService } from './event/event.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventService: EventService,
  ) { }

  @Get()
  async getHello(): Promise<string> {
    console.log('aqui');
    // discover('e3', 'HB', 'data');
    const teste = await this.eventService.getEvent();
    console.log('tam', teste.length);
    teste.forEach((t) => console.log(t.toJSON()));
    return this.appService.getHello();
    // return this.appService.getHello();
  }
}
