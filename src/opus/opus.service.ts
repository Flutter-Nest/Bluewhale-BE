import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { S3Service } from "src/s3/s3.service";
import * as fs from "fs";

@Injectable()
export class OpusService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async allDeleteFilesInFolder() {
    const folderPath = process.env.UPLOAD_FOLDER_PATH;
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) await fs.promises.unlink(`${folderPath}/${file}`);
  }

  async fetchOpus(user, query) {
    let queryUserId;

    if (user.role === "parent" && user.studentId !== 0) {
      queryUserId = user.studentId;
    } else if (user.role === "student" && user.studentId === 0) {
      queryUserId = user.userId;
    } else {
      queryUserId = user.userId;
    }

    const rawResult = await this.prisma.opus.findMany({
      where: {
        studentId: queryUserId,
        date: {
          equals: query.date,
        },
      },
      select: {
        opusId: true,
        teacherId: true,
        date: true,
        title: true,
        content: true,
        grade: true,
        className: true,
        time: true,
        opusUrl: true,
        fileName0: true,
        fileUrl0: true,
        fileName1: true,
        fileUrl1: true,
        fileName2: true,
        fileUrl2: true,
        Subject: {
          select: {
            subjectId: true,
            subjectColor: true,
          },
        },
      },
    });

    const result = rawResult.map((item) => ({
      id: item.opusId,
      teacherId: item.teacherId,
      date: item.date,
      title: item.title,
      content: item.content,
      grade: item.grade,
      className: item.className,
      time: item.time,
      opusUrl: item.opusUrl,
      fileName0: item.fileName0,
      fileUrl0: item.fileUrl0,
      fileName1: item.fileName1,
      fileUrl1: item.fileUrl1,
      fileName2: item.fileName2,
      fileUrl2: item.fileUrl2,
      subjectId: item.Subject.subjectId,
      subjectColor: item.Subject.subjectColor,
    }));
    return result;
  }

  async createOpus(userId: number, body, files) {
    const awsFileKey = `file`;
    const uploadedFiles = await this.s3Service.uploadFile(awsFileKey, files);

    const grade = +body.grade;
    const { subjectId, title, content, opusUrl, className, date, time } = body;

    const isoDate = new Date(date).toISOString();

    const students = await this.prisma.users.findMany({
      where: {
        grade,
        className,
      },
      select: {
        userId: true,
      },
    });

    const studentIdArray = students.map((student) => student.userId);
    const opusData = studentIdArray.map((studentId) => ({
      subjectId,
      title,
      content,
      opusUrl,
      grade,
      className,
      date: isoDate,
      time,
      teacherId: userId,
      studentId,
    }));

    const result = await this.prisma.opus.createMany({
      data: opusData,
    });

    await this.allDeleteFilesInFolder();

    return result;
  }

  async createConsulting(userId: number, body) {
    const { subjectId, title, content, grade, className, date, time } = body;
    const isoDate = new Date(date).toISOString();

    const result = await this.prisma.opus.create({
      data: {
        subjectId,
        title,
        content,
        grade,
        className,
        date: isoDate,
        time,
        teacherId: userId,
        studentId: body.studentId,
      },
    });

    return result;
  }
}
