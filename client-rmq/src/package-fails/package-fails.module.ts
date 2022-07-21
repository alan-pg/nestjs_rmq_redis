import { Module } from '@nestjs/common';
import { PackageFailsService } from './package-fails.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PackageFail } from './entities/package-fail.entity';

@Module({
  imports: [SequelizeModule.forFeature([PackageFail])],
  providers: [PackageFailsService],
  exports: [SequelizeModule],
})
export class PackageFailsModule { }
