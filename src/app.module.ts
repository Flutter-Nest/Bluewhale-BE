import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { CoreModule } from "./core/core.module";
import { ResponseDelayInterceptor } from "./core/interceptor/response-delay.interceptor";
import { OrderModule } from "./order/order.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";
import { RatingModule } from "./rating/rating.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProductModule,
    CacheModule,
    RestaurantModule,
    CoreModule,
    RatingModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseDelayInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
