import { Test, TestingModule } from '@nestjs/testing';
import { OpusController } from './opus.controller';
import { OpusService } from './opus.service';

describe('OpusController', () => {
  let controller: OpusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpusController],
      providers: [OpusService],
    }).compile();

    controller = module.get<OpusController>(OpusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
