import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CacheModule } from "../cache/cache.module";
import { CoreModule } from "../core/core.module";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";

@Module({
  imports: [AuthModule, CoreModule, CacheModule],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
