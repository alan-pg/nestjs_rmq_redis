import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'redis-om';
import { CreateEventDto } from './dto/create-event.dto';
import { EventTemporary } from './entities/event-cache.entity';
import { Event } from './entities/event.entity';
import SequelizeTS from 'sequelize-typescript';
import { randomUUID } from 'crypto';

@Injectable()
export class EventService {
  constructor(
    @Inject('REDIS_EVENT')
    private readonly eventRepository: Repository<EventTemporary>,
    @InjectModel(Event)
    private eventModel: SequelizeTS.Repository<Event>,
  ) { }
  async createEvent(
    events: CreateEventDto[],
  ): Promise<{ error: boolean; errorMessage?: string }> {
    let cachedIds: string[];
    const eventsToSave = events.map((e) => ({
      id: randomUUID(),
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
    }));
    try {
      cachedIds = await Promise.all(
        eventsToSave.map((e) => {
          const eventRedis = this.eventRepository.createEntity(e);
          return this.eventRepository.save(eventRedis);
        }),
      );
    } catch (error) {
      console.log('save_redis_events_error', error);
      return { error: true, errorMessage: 'save_redis_events_error' };
    }
    try {
      // await this.eventModel.create(events[0] as any);
      await this.eventModel.bulkCreate(eventsToSave as any);
    } catch (error) {
      console.log('error_save_mysql_event', error);
      await this.eventRepository.remove(cachedIds);
      return { error: true, errorMessage: 'save_mysql_events_error' };
    }

    return { error: false };
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
