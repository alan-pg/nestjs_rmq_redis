/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'redis-om';
import { CreatePositionDto } from './dto/create-position.dto';
import { LastPosition } from './entities/last-position.entity';

@Injectable()
export class PositionService {
    constructor(
        @Inject('REDIS_LAST_POSITION')
        private readonly lastPositionRepo: Repository<LastPosition>,
    ) { }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async createOrUprateLastPosition(
        position: CreatePositionDto,
    ): Promise<string> {
        // await this.sleep(10000)
        const lpFound = await this.lastPositionRepo
            .search()
            .where('deviceId')
            .equalTo(position.deviceId)
            .returnFirst();
        if (lpFound) {
            lpFound.deviceId = Number(position.deviceId) || null;
            lpFound.header = position.header || null;
            lpFound.dateTime = position.dateTime || null;
            lpFound.dateSystem = position.dateSystem || null;
            lpFound.position = {
                latitude: Number(position.latitude),
                longitude: Number(position.longitude),
            };
            lpFound.ignition = position.ignition || null;
            lpFound.speed = position.speed || null;
            lpFound.direction = position.direction || null;
            lpFound.odometer = position.odometer || null;
            lpFound.signal = position.signal || null;
            lpFound.bateryPercent = position.bateryPercent || null;
            lpFound.voltage = position.voltage || null;
            lpFound.satellite = position.satellite || null;
            lpFound.out1 = position.out1 === undefined ? null : position.out1;
            lpFound.out2 = position.out2 === undefined ? null : position.out2;
            await this.lastPositionRepo.save(lpFound);
        } else {
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
            return this.lastPositionRepo.save(lastPos);
        }
    }
}
