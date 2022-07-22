import { randomUUID } from 'crypto';
import {
    Column,
    Model,
    Table,
    PrimaryKey,
    BeforeCreate,
    IsUUID,
} from 'sequelize-typescript';

@Table({ tableName: 'events' })
export class Event extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Column
    deviceId: string;

    @Column
    event: string;

    @Column
    eventSlug: string;

    @Column
    header: string;

    @Column
    longitude: string;

    @Column
    latitude: string;

    @Column
    ignition: boolean;

    @Column
    direction: string;

    @Column
    bateryPercent: string;

    @Column
    voltage: string;

    @Column
    odometer: string;

    @Column
    satellite: string;

    @Column
    signal: string;

    @Column
    speed: string;

    @Column
    out1: boolean;

    @Column
    out2: boolean;

    @Column
    dateSystem: string;

    @Column
    dateTime: string;

    @Column
    read: boolean;

    @Column
    treated: boolean;

    @Column
    status: string;

    @Column
    treatedEventId: string;

    // @BeforeCreate
    // static generateId(instance: Event): void {
    //     instance.id = randomUUID();
    // }
}
