import { Test, TestingModule } from '@nestjs/testing';
import { OpusService } from './opus.service';

describe('OpusService', () => {
  let service: OpusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpusService],
    }).compile();

    service = module.get<OpusService>(OpusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
