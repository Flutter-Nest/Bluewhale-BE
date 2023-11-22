import { Module } from '@nestjs/common';
import { OpusService } from './opus.service';
import { OpusController } from './opus.controller';

@Module({
  controllers: [OpusController],
  providers: [OpusService]
})
export class OpusModule {}
