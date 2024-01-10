import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async createSchedule(userId: number, body) {
    const result = await this.prisma.schedules.create({
      data: {
        userId,
        completion: body.completion,
        subject: body.subject,
        content: body.content,
        date: body.date,
      },
    });

    return result;
  }

  async fetchSchedules(user) {
    let queryUserId: number;

    if (user.role === "parent" && user.studentId !== 0) {
      queryUserId = user.studentId;
    } else if (user.role === "student" && user.studentId === 0) {
      queryUserId = user.userId;
    } else {
      queryUserId = user.userId;
    }

    const rawResult = await this.prisma.schedules.findMany({
      where: {
        userId: queryUserId,
      },
      select: {
        id: true,
        date: true,
        content: true,
        completion: true,
        subject: true,
        time: true,
      },
    });

    const result = rawResult.map((item) => ({
      id: item.id,
      content: item.content,
      date: item.date,
      completion: item.completion,
      subject: item.subject,
      time: item.time,
    }));
    return result;
  }

  async fetchOneSchedule(scheduleId: number) {
    const rawResult = await this.prisma.schedules.findFirst({
      where: { id: scheduleId },
      select: {
        id: true,
        date: true,
        content: true,
        completion: true,
        subject: true,
        time: true,
      },
    });

    const result = {
      id: rawResult.id,
      content: rawResult.content,
      date: rawResult.date,
      completion: rawResult.completion,
      subject: rawResult.subject,
      time: rawResult.time,
    };
    return result;
  }

  async updateSchedule(scheduleId: number, body: any) {
    const { content, date, time, completion, subject } = body;

    return await this.prisma.schedules.update({
      where: {
        id: scheduleId,
      },
      data: {
        content,
        date,
        time,
        completion,
        subject,
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

  async deleteSchedule(scheduleId: number) {
    await this.prisma.schedules.delete({
      where: { id: scheduleId },
    });
  }
}
