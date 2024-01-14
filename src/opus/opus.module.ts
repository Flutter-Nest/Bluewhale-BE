import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { OpusController } from "./opus.controller";
import { OpusService } from "./opus.service";
import { S3Module } from "src/s3/s3.module";
import { MulterModule } from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    S3Module,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folderPath = process.env.UPLOAD_FOLDER_PATH;
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath, { recursive: true });
            }
            cb(null, folderPath);
          },
          filename: (req, file, cb) => {
            const decodedFilename = decodeURIComponent(file.originalname);
            cb(null, decodedFilename);
          },
        }),
      }),
    }),
  ],
  controllers: [OpusController],
  providers: [OpusService],
})
export class OpusModule {}
