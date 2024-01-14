import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  ListObjectsOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Logger } from "@nestjs/common";
import * as fs from "fs";
import { PrismaService } from "src/prisma/prisma.service";

export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  private uploadFolderPath: string;
  private s3Bucket: string;
  private s3: S3Client;

  constructor(private prisma: PrismaService) {
    this.uploadFolderPath = process.env.UPLOAD_FOLDER_PATH;
    this.s3Bucket = process.env.AWS_BUCKET_NAME;

    this.s3 = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getS3List(dataType: string, key: string): Promise<ListObjectsOutput> {
    const bucket = this.s3Bucket;
    return await this.s3.send(
      new ListObjectsCommand({ Bucket: bucket, Prefix: key })
    );
  }

  async uploadFile(key, files) {
    const uploadedFiles = [];

    try {
      const bucket = this.s3Bucket;
      const region = process.env.AWS_BUCKET_REGION;

      for (const f of files) {
        const decodedFilename = decodeURIComponent(f.originalname);

        const fileName = decodedFilename.split(".").slice(0, -1).join(".");
        const fileExtension = decodedFilename.split(".").pop();

        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const newFilename = `${fileName}_${timestamp}.${fileExtension}`;

        const Key = `${key}/${newFilename}`;
        const filePath = `${this.uploadFolderPath}/${decodedFilename}`;
        const stream = fs.createReadStream(filePath);

        await this.s3.send(
          new PutObjectCommand({ Bucket: bucket, Key, Body: stream })
        );

        const url = `https://${bucket}.s3.${region}.amazonaws.com/${Key}`;
        uploadedFiles.push({ url, filename: newFilename });
      }

      this.logger.log(`[ ${bucket} Successfully S3 Upload ]`);
    } catch (err) {
      this.logger.error("Error", err);
    }

    return uploadedFiles;
  }

  async uploadProfileImage(
    key: string,
    file: Express.Multer.File
  ): Promise<{ url: string; filename: string }> {
    try {
      const region = process.env.AWS_BUCKET_REGION;
      const bucket = this.s3Bucket;
      const decodedFilename = decodeURIComponent(file.originalname);
      const fileName = decodedFilename.split(".").slice(0, -1).join(".");
      const fileExtension = decodedFilename.split(".").pop();

      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const newFilename = `${fileName}_${timestamp}.${fileExtension}`;

      const Key = `${key}/${newFilename}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.s3Bucket,
          Key,
          Body: file.buffer,
        })
      );

      const url = `https://${bucket}.s3.${region}.amazonaws.com/${Key}`;

      return { url, filename: newFilename };
    } catch (err) {
      console.error("Error uploading file: ", err);
      throw err;
    }
  }

  async deleteFile(dataType: string, key: string): Promise<void> {
    try {
      const bucket = this.s3Bucket;

      const Key = `${key}`;
      await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key }));
      this.logger.log(`[ ${bucket} Successfully Deleted from S3 ]`);
    } catch (err) {
      this.logger.error("Error", err);
    }
  }

  async deleteVersion(
    serverType: string,
    dataType: string,
    dataVersion: string
  ) {
    try {
      const bucket = this.s3Bucket;

      const folderPath = `${serverType}/${dataVersion}/`;

      const listParams = {
        Bucket: bucket,
        Prefix: folderPath,
      };
      const listedObjects = await this.s3.send(
        new ListObjectsV2Command(listParams)
      );

      if (listedObjects.Contents.length === 0) return;

      const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
      };

      // 객체 삭제
      await this.s3.send(new DeleteObjectsCommand(deleteParams));

      if (listedObjects.IsTruncated) {
        await this.deleteVersion(serverType, dataType, dataVersion);
      }

      this.logger.log(`[ ${folderPath} Successfully Deleted from S3 ]`);
    } catch (err) {
      this.logger.error("Error", err);
    }
  }

  // async createClientSeedFile(
  //   dataVersion: string,
  //   dataType: string,
  //   key: string,
  //   clientKeyVersion?: string,
  //   dataDoor?: string,
  //   dataHive?: string
  // ): Promise<void> {
  //   if (!clientKeyVersion || !dataDoor || !dataHive) {
  //     const clientKeyEntities = await this.dataSource
  //       .getRepository(ClientKeyEntity)
  //       .find();
  //     clientKeyEntities.sort(
  //       (a, b) => parseInt(b.clientKeyVersion) - parseInt(a.clientKeyVersion)
  //     );
  //     const clientKeyEntity = clientKeyEntities[0];
  //     clientKeyVersion = clientKeyEntity?.clientKeyVersion;
  //     dataDoor = clientKeyEntity?.dataDoor;
  //     dataHive = clientKeyEntity?.dataHive;
  //   }

  //   // S3에서 파일 목록 조회
  //   const result = await this.getS3List(dataType, key);
  //   const items = [];

  //   for (const c of result.Contents) {
  //     const filename = c.Key.split(`${dataVersion}/`)[1];
  //     const hash = c.ETag.split('"')[1];
  //     const size = c.Size;

  //     if (filename !== "seed.json") {
  //       items.push({ fileName: filename, hash: hash, size: size });
  //     }
  //   }

  //   const clientFileHashs = {
  //     version: dataVersion,
  //     clientKeyVersion: clientKeyVersion,
  //     dataDoor: dataDoor,
  //     dataHive: dataHive,
  //     items: items,
  //   };

  //   fs.writeFileSync(
  //     `${this.uploadFolderPath}/seed.json`,
  //     beautify(clientFileHashs, null, 2, 80)
  //   );

  //   const files: Express.Multer.File[] = [];
  //   files.push({
  //     fieldname: "files",
  //     originalname: "seed.json",
  //     encoding: "7bit",
  //     mimetype: "application/json",
  //     stream: null,
  //     destination: "./uploads",
  //     filename: "seed.json",
  //     path: "uploads/seed.json",
  //     size: null,
  //     buffer: null,
  //   });

  //   await this.uploadFile(dataType, key, files);
  // }

  // async downloadAndZipFiles(
  //   serverType: string,
  //   dataType: string,
  //   dataVersion: string,
  //   response
  // ) {
  //   try {
  //     const bucket =
  //       dataType === "server" ? this.s3ServerBucket : this.s3ClientBucket;
  //     const folderPath = `${serverType}/${dataVersion}/`;

  //     const listParams = {
  //       Bucket: bucket,
  //       Prefix: folderPath,
  //     };
  //     const listedObjects = await this.s3.send(
  //       new ListObjectsV2Command(listParams)
  //     );

  //     if (listedObjects.Contents.length === 0) {
  //       throw new Error("No files found to zip");
  //     }

  //     const archive = archiver("zip", { zlib: { level: 9 } });
  //     archive.on("error", (err) => {
  //       throw err;
  //     });

  //     response.attachment(`${serverType}_${dataType}_${dataVersion}.zip`);
  //     archive.pipe(response);

  //     for (const object of listedObjects.Contents) {
  //       const stream = await this.getObjectStream(bucket, object.Key);
  //       archive.append(stream, { name: object.Key.split("/").pop() });
  //     }

  //     archive.finalize().then(() => {
  //       response.end();
  //     });
  //   } catch (err) {
  //     this.logger.error("Error", err);
  //     response.status(500).send("Error occurred during file download");
  //   }
  // }

  // async getObjectStream(bucket: string, key: string): Promise<Readable> {
  //   const params = { Bucket: bucket, Key: key };
  //   const command = new GetObjectCommand(params);
  //   const { Body } = await this.s3.send(command);

  //   if (Body instanceof Readable) {
  //     return Body;
  //   } else {
  //     throw new Error("Failed to get a valid stream from S3");
  //   }
  // }
}
