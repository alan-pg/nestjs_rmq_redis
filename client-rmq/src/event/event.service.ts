import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'redis-om';
import { CreateEventDto } from './dto/create-event.dto';
import { EventTemporary } from './entities/event-cache.entity';

@Injectable()
export class EventService {
  constructor(
    @Inject('REDIS_EVENT')
    private readonly eventRepository: Repository<EventTemporary>,
  ) { }
  async createEvent(events: CreateEventDto[]) {
    const teste = await Promise.all(
      events.map((e) => {
        const eventRedis = this.eventRepository.createEntity({
          deviceId: Number(e.deviceId),
          event: e.event,
          eventSlug: e.eventSlug,
          header: e.header,
          latitude: e.latitude,
          longitude: e.longitude,
          direction: e.direction,
          ignition: e.ignition,
          odometer: e.odometer,
          satellite: e.satellite,
          signal: e.signal,
          speed: e.speed,
          bateryPercent: e.bateryPercent,
          voltage: e.voltage,
          out1: e.out1,
          out2: e.out2,
          dateTime: e.dateTime,
          dateSystem: e.dateSystem,
          read: false,
          treated: false,
        });

        return this.eventRepository.save(eventRedis);
      }),
    );

    return 'This action adds a new event';
  }

  async getEvent() {
    // return this.eventRepository.search().where('eventSlug').eq('').return.all();
    return this.eventRepository
      .search()
      .where('deviceId')
      .equalTo(354522184541154)
      .and('eventSlug')
      .equalTo('light_sensor_violation')
      .or('eventSlug')
      .equalTo('harsh_brake')
      .returnAll();
  }
}
