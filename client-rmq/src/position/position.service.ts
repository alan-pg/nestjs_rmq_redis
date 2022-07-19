import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'redis-om';
import { CreatePositionDto } from './dto/create-position.dto';
import { LastPosition } from './entities/last-position.entity';

@Injectable()
export class PositionService {
  constructor(
    @Inject('REDIS_LAST_POSITION')
    private readonly lastPositionRepo: Repository<LastPosition>,
  ) {}
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async createOrUprateLastPosition(
    position: CreatePositionDto,
  ): Promise<string> {
    // await this.sleep(10000)

    console.log('CRIA NOVO');
    const lastPos = this.lastPositionRepo.createEntity({
      keyName: 'teste123',
      entityId: '123456',
      deviceId: Number(position.deviceId) || null,
      header: position.header || null,
      dateTime: position.dateTime || null,
      dateSystem: position.dateSystem || null,
      position: {
        latitude: Number(position.latitude),
        longitude: Number(position.longitude),
      },
      ignition: position.ignition || null,
      speed: position.speed || null,
      direction: position.direction || null,
      odometer: position.odometer || null,
      signal: position.signal || null,
      bateryPercent: position.bateryPercent || null,
      voltage: position.voltage || null,
      satellite: position.satellite || null,
      out1: position.out1 === undefined ? null : position.out1,
      out2: position.out2 === undefined ? null : position.out2,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    lastPos.entityId = position.deviceId;

    return this.lastPositionRepo.save(lastPos);
  }

  getLpById() {
    return this.lastPositionRepo
      .search()
      .where('deviceId')
      .equals(454522183689854)
      .returnAll();
  }
}
