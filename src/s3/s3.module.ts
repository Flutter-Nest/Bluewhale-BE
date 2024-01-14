import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Controller } from "./s3.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
