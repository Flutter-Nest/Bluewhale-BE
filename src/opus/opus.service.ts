import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OpusService {
  constructor(private prisma: PrismaService) {}
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
      subjectId: item.Subject.subjectId,
      subjectColor: item.Subject.subjectColor,
    }));
    return result;
  }

  async createOpus(userId: number, body) {
    console.log(body);
    const { subjectId, title, content, opusUrl, grade, className, date, time } =
      body;

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
