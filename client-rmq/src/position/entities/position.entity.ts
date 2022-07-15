import { Table, Column, Model } from 'sequelize-typescript';

@Table({
    tableName: 'positions',
})
export class Position extends Model {
    @Column
    text: string;
}

//sqlite
//biblioteca persistencia
