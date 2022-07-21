import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'treatment',
      logging: false,
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class SequelizeDbModule { }
