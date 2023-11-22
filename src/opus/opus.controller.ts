import { Controller } from '@nestjs/common';
import { OpusService } from './opus.service';

@Controller('opus')
export class OpusController {
  constructor(private readonly opusService: OpusService) {}
}
