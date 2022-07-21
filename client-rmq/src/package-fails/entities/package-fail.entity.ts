import { randomUUID } from 'crypto';
import {
    Column,
    Model,
    Table,
    PrimaryKey,
    BeforeCreate,
} from 'sequelize-typescript';

@Table({ tableName: 'package_fails' })
export class PackageFail extends Model {
    @PrimaryKey
    @Column
    id: string;

    @Column
    cmd: string;

    @Column
    data: string;

    @Column
    date: Date;

    @Column
    trackerModel: string;

    @Column
    reason: string;

    @BeforeCreate
    static generateId(instance: PackageFail): void {
        instance.id = randomUUID();
    }
}
