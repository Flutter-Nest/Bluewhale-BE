import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(userId: number, body) {
    const { title, content, grade, className } = body;

    const students = await this.prisma.users.findMany({
      where: {
        grade,
        className,
      },
      select: {
        userId: true,
      },
    });

    const notificationData = students.map((student) => ({
      title,
      content,
      grade,
      className,
      userId: student.userId,
    }));

    const result = await this.prisma.notifications.createMany({
      data: notificationData,
    });

    return result;
  }

  async fetchNotifications(user) {
    let queryGrade;
    let queryClassName;

    if (user.role === "parent" && user.studentId !== 0) {
      const student = await this.prisma.users.findUnique({
        where: { userId: user.studentId },
        select: {
          grade: true,
          className: true,
        },
      });

      if (student) {
        queryGrade = student.grade;
        queryClassName = student.className;
      } else {
        return [];
      }
    } else {
      queryGrade = user.grade;
      queryClassName = user.className;
    }

    const result = await this.prisma.notifications.findMany({
      where: {
        grade: queryGrade,
        className: queryClassName,
      },
    });

    return result;
  }

  async updateIsRead(id: number) {
    const result = await this.prisma.notifications.update({
      where: {
        notificationId: id,
      },
      data: {
        isRead: true,
      },
    });

    return result;
  }
}
