import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CacheModule } from "../cache/cache.module";
import { CoreModule } from "../core/core.module";
import { UserModule } from "../user/user.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [AuthModule, UserModule, CacheModule, CoreModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
