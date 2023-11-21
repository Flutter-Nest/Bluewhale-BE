import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async createSchedule(userId: number, body) {
    const result = await this.prisma.schedules.create({
      data: {
        userId,
        subjectId: body.colorId,
        startTime: body.startTime,
        endTime: body.endTime,
        completion: body.completion,
        content: body.content,
        date: body.date,
      },
    });

    return result;
  }

  async fetchSchedules(userId: number, query) {
    const rawResult = await this.prisma.schedules.findMany({
      where: {
        userId,
        date: {
          equals: query.date,
        },
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        content: true,
        completion: true,
        Subject: {
          select: {
            subjectId: true,
            subjectColor: true,
          },
        },
      },
    });

    const result = rawResult.map((item) => ({
      id: item.id,
      content: item.content,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      completion: item.completion,
      subjectColor: item.Subject.subjectColor,
      subjectId: item.Subject.subjectId,
    }));

    return result;
  }

  async fetchOneSchedule(scheduleId: number) {
    const rawResult = await this.prisma.schedules.findFirst({
      where: { id: scheduleId },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        content: true,
        completion: true,
        Subject: {
          select: {
            subjectId: true,
            subjectColor: true,
          },
        },
      },
    });

    const result = {
      id: rawResult.id,
      content: rawResult.content,
      date: rawResult.date,
      startTime: rawResult.startTime,
      endTime: rawResult.endTime,
      completion: rawResult.completion,
      subjectColor: rawResult.Subject.subjectColor,
      subjectId: rawResult.Subject.subjectId,
    };
    return result;
  }

  async updateSchedule(scheduleId: number, body: any) {
    const { id, content, date, startTime, endTime, completion, subjectId } =
      body;

    return await this.prisma.schedules.update({
      where: {
        id: scheduleId,
      },
      data: {
        content,
        date,
        startTime,
        endTime,
        completion,
        subjectId,
      },
    });
  }

  async fetchColors() {
    const result = await this.prisma.subjects.findMany({
      select: {
        subjectId: true,
        subjectColor: true,
      },
    });
    return result;
  }
}
