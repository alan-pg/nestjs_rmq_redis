import { Column, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table
export class Event extends Model {
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
}
