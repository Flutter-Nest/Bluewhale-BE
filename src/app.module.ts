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
import { InterviewModule } from "./interview/interview.module";
import { OpusModule } from "./opus/opus.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { UserModule } from "./user/user.module";
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CacheModule,
    CoreModule,
    ScheduleModule,
    InterviewModule,
    OpusModule,
    TestModule,
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
