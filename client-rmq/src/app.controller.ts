import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { discovery } from './discover';
import { LastPositionService } from './position2/last-position.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private positionService: LastPositionService,
  ) { }

  @Get()
  getHello(): Promise<string> {
    console.log('aqui');
    discovery('e3', 'HB', 'data');
    return this.positionService.handlePosition('teste data');
    // return this.appService.getHello();
  }
}
