import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
