import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { S3Module } from "src/s3/s3.module";

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule, S3Module],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
