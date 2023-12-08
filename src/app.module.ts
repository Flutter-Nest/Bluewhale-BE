import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { CoreModule } from "./core/core.module";
import { InterviewModule } from "./interview/interview.module";
import { OpusModule } from "./opus/opus.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { TestModule } from "./test/test.module";
import { UserModule } from "./user/user.module";
import { ConsultingModule } from './consulting/consulting.module';
import { ConsultingCommentModule } from './consulting-comment/consulting-comment.module';
import { AttendanceModule } from './attendance/attendance.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CoreModule,
    ScheduleModule,
    InterviewModule,
    OpusModule,
    TestModule,
    ConsultingModule,
    ConsultingCommentModule,
    AttendanceModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
