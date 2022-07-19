import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'redis-om';
import { CreatePositionDto } from './dto/create-position.dto';
import { LastPosition } from './entities/last-position.entity';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionService {
  constructor(
    @Inject('REDIS_LAST_POSITION')
    private readonly lastPositionRepo: Repository<LastPosition>,
    @InjectModel(Position)
    private positionModel: typeof Position,
  ) { }

  async createOrUprateLastPosition(
    position: CreatePositionDto,
  ): Promise<string> {
    const lastPos = this.lastPositionRepo.createEntity({
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
    const teste = await this.positionModel.create({ deviceId: '1234456' });
    console.log(
      '🚀 ~ file: position.service.ts ~ line 44 ~ PositionService ~ teste',
      teste,
    );
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
