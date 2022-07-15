import { Test, TestingModule } from '@nestjs/testing';
import { LastPositionService } from './last-position.service';

describe('LastPositionService', () => {
  let service: LastPositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastPositionService],
    }).compile();

    service = module.get<LastPositionService>(LastPositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
