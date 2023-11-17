import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CacheModule } from "../cache/cache.module";
import { CoreModule } from "../core/core.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [CacheModule, AuthModule, CoreModule],
})
export class OrderModule {}
