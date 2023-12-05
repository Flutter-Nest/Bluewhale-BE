import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConsultingCommentController } from "./consulting-comment.controller";
import { ConsultingCommentService } from "./consulting-comment.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ConsultingCommentController],
  providers: [ConsultingCommentService],
})
export class ConsultingCommentModule {}
