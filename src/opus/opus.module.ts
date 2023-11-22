import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { OpusController } from "./opus.controller";
import { OpusService } from "./opus.service";

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [OpusController],
  providers: [OpusService],
})
export class OpusModule {}
