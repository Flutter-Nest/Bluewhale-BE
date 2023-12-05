import { Test, TestingModule } from '@nestjs/testing';
import { ConsultingCommentController } from './consulting-comment.controller';
import { ConsultingCommentService } from './consulting-comment.service';

describe('ConsultingCommentController', () => {
  let controller: ConsultingCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultingCommentController],
      providers: [ConsultingCommentService],
    }).compile();

    controller = module.get<ConsultingCommentController>(ConsultingCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
