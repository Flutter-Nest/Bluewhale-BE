import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConsultingController } from "./consulting.controller";
import { ConsultingService } from "./consulting.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ConsultingController],
  providers: [ConsultingService],
})
export class ConsultingModule {}
