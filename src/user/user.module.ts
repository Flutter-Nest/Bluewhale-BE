import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule), PrismaModule],
})
export class UserModule {}
