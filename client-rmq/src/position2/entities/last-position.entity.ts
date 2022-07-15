/* eslint-disable prettier/prettier */
import { Entity, Schema } from 'redis-om';

class LastPosition extends Entity { }

export const lastPositionSchema = new Schema(LastPosition, {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    age: { type: 'number' },
    verified: { type: 'boolean' },
    location: { type: 'point' },
    locationUpdated: { type: 'date' },
    skills: { type: 'string[]' },
    personalStatement: { type: 'text' },
});
