// export class Position {}
import { Entity, Schema } from 'redis-om';

/* our entity */
export class EventTemporary extends Entity {
    deviceId: number | null;
    event: string;
    eventSlug: string;
    header: string | null;
    latitude: string;
    longitude: string;
    direction: string | null;
    ignition: string | null;
    odometer: string | null;
    satellite: string | null;
    signal: string | null;
    speed: string | null;
    bateryPercent: string | null;
    voltage: string | null;
    out1: boolean | null;
    out2: boolean | null;
    dateTime: string | null;
    dateSystem: string | null;
    read: boolean;
    treated: boolean;
}

/* create a Schema for Person */
export const eventTemporarySchema = new Schema(
    EventTemporary,
    {
        deviceId: { type: 'number', sortable: true },
        event: { type: 'string' },
        eventSlug: { type: 'string', sortable: true },
        header: { type: 'string' },
        dateTime: { type: 'date', sortable: true },
        dateSystem: { type: 'date', sortable: true },
        latitude: { type: 'string' },
        longitude: { type: 'string' },
        ignition: { type: 'boolean' },
        direction: { type: 'string' },
        speed: { type: 'string' },
        bateryPercent: { type: 'string' },
        voltage: { type: 'string' },
        odometer: { type: 'string' },
        satellite: { type: 'string' },
        signal: { type: 'string' },
        out1: { type: 'boolean' },
        out2: { type: 'boolean' },
        treated: { type: 'boolean' },
        read: { type: 'boolean' },
    },
    {
        // dataStructure: 'HASH',
    },
);
