import { randomUUID } from 'crypto';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  BeforeCreate,
} from 'sequelize-typescript';

@Table({
  tableName: 'positions',
  underscored: true,
  timestamps: true,
})
export class Position extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  header: string;

  @Column
  deviceId: string;

  @Column
  dateTime: string;

  @Column
  latitude: string;

  @Column
  longitude: string;

  @Column
  direction: string;

  @Column
  ignition: string;

  @Column
  odometer: string;

  @Column
  bateryPercent: string;

  @Column
  voltage: string;

  @Column
  speed: string;

  @Column
  satellite: string;

  @Column
  signal: string;

  @Column
  out1: string;

  @Column
  out2: string;

  @BeforeCreate
  static generateId(instance: Position): void {
    instance.id = randomUUID();
  }
}
