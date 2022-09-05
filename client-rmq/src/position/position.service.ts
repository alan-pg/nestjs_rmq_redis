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
  ): Promise<{ error: boolean; errorMessage?: string }> {
    try {
      const lPExists = await this.lastPositionRepo.fetch(position.deviceId);
      if (lPExists.deviceId) {
        console.log('update lp');
        lPExists.deviceId = Number(position.deviceId) || null;
        lPExists.header = position.header || null;
        lPExists.dateTime = position.dateTime || null;
        lPExists.dateSystem = position.dateSystem || null;
        lPExists.position = {
          latitude: Number(position.latitude),
          longitude: Number(position.longitude),
        };
        lPExists.ignition = position.ignition || null;
        lPExists.speed = position.speed || null;
        lPExists.direction = position.direction || null;
        lPExists.odometer = position.odometer || null;
        lPExists.signal = position.signal || null;
        lPExists.bateryPercent = position.bateryPercent || null;
        lPExists.voltage = position.voltage || null;
        lPExists.satellite = position.satellite || null;
        lPExists.out1 = position.out1 === undefined ? null : position.out1;
        lPExists.out2 = position.out2 === undefined ? null : position.out2;
        lPExists.heartBeat = position.dateSystem || null;
        await this.lastPositionRepo.save(lPExists);
      } else {
        console.log('create lp');
        const newLp = this.lastPositionRepo.createEntity({
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
        newLp.entityId = position.deviceId;
        await this.lastPositionRepo.save(newLp);
      }
    } catch (error) {
      console.log('erro ao salvar position no redis', error);
      return { error: true, errorMessage: 'save_redis_position_error' };
    }
    try {
      await this.positionModel.create({ ...position });
    } catch (error) {
      console.log('erro ao salvar position no mysql', error);
      return { error: true, errorMessage: 'save_mysql_position_error' };
    }
    return { error: false };
  }

  async updateHeartBeat() { }

  getLpById() {
    return this.lastPositionRepo
      .search()
      .where('deviceId')
      .equals(454522183689854)
      .returnAll();
  }
}
