import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class OpusService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}
  async fetchOpus(userId: number, query) {
    const { grade, className } = await this.userService.findUserById(userId);
    const rawResult = await this.prisma.opus.findMany({
      where: {
        grade,
        className,
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
        Subject: {
          select: {
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
      subjectColor: item.Subject.subjectColor,
    }));
    return result;
  }

  async createOpus(userId: number, body) {
    const { subjectId, title, content, grade, className, date, time } = body;

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
