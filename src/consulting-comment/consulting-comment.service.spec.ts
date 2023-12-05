import { Test, TestingModule } from '@nestjs/testing';
import { ConsultingCommentService } from './consulting-comment.service';

describe('ConsultingCommentService', () => {
  let service: ConsultingCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultingCommentService],
    }).compile();

    service = module.get<ConsultingCommentService>(ConsultingCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
