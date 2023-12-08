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
    const result = await this.prisma.notifications.findMany({
      where: {
        grade: user.grade,
        className: user.className,
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
