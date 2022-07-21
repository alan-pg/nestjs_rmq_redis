import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePackageFailDto } from './dto/create-package-fail.dto';
import { PackageFail } from './entities/package-fail.entity';

@Injectable()
export class PackageFailsService {
  constructor(
    @InjectModel(PackageFail)
    private packageFailModel: typeof PackageFail,
  ) { }

  async create(packageFail: CreatePackageFailDto) {
    try {
      await this.packageFailModel.create({ ...packageFail });
      return { error: false };
    } catch (error) {
      return { error: true };
    }
  }
}
