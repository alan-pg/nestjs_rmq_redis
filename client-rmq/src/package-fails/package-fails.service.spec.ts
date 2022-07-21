import { Test, TestingModule } from '@nestjs/testing';
import { PackageFailsService } from './package-fails.service';

describe('PackageFailsService', () => {
  let service: PackageFailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackageFailsService],
    }).compile();

    service = module.get<PackageFailsService>(PackageFailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
