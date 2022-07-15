/* eslint-disable prettier/prettier */
// export class Position {}
import { Entity, Schema } from 'redis-om';

/* our entity */
export class LastPosition extends Entity {
    deviceId: number | null;
    header: string | null;
    dateTime: string | null;
    dateSystem: string | null;
    position: {
        latitude: number | null;
        longitude: number | null;
    } | null;
    inFence: string | null;
    ignition: string | null;
    direction: string | null;
    speed: string | null;
    bateryPercent: string | null;
    voltage: string | null;
    odometer: string | null;
    satellite: string | null;
    signal: string | null;
    out1: boolean | null;
    out2: boolean | null;
}

/* create a Schema for Person */
export const lastPositionSchema = new Schema(LastPosition, {
    deviceId: { type: 'string', sortable: true },
    header: { type: 'string' },
    dateTime: { type: 'date' },
    dateSystem: { type: 'date' },
    position: { type: 'point' },
    inFence: { type: 'string' },
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
    tx: { type: 'date' }
});

