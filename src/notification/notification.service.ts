import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(userId: number, body) {
    const {
      title,
      content,
      grade,
      className,
      koreanClassName,
      englishClassName,
    } = body;

    let students;

    if (koreanClassName) {
      students = await this.prisma.users.findMany({
        where: {
          grade,
          koreanClassName,
        },
        select: {
          userId: true,
        },
      });

      const notificationData = students.map((student) => ({
        title,
        content,
        grade,
        koreanClassName,
        userId: student.userId,
      }));

      const result = await this.prisma.notifications.createMany({
        data: notificationData,
      });
      return result;
    } else {
      students = await this.prisma.users.findMany({
        where: {
          grade,
          englishClassName,
        },
        select: {
          userId: true,
        },
      });

      const notificationData = students.map((student) => ({
        title,
        content,
        grade,
        englishClassName,
        userId: student.userId,
      }));

      const result = await this.prisma.notifications.createMany({
        data: notificationData,
      });
      return result;
    }
  }

  async fetchNotifications(user) {
    let notifications = [];

    if (user.role === "parent" && user.studentId !== 0) {
      const student = await this.prisma.users.findUnique({
        where: { userId: user.studentId },
        select: {
          grade: true,
          koreanClassName: true,
          englishClassName: true,
        },
      });

      if (student) {
        // 한국어 클래스 알림 조회
        const koreanClassNotifications =
          await this.prisma.notifications.findMany({
            where: {
              grade: student.grade,
              AND: [{ className: student.koreanClassName }],
            },
          });

        const englishClassNotifications =
          await this.prisma.notifications.findMany({
            where: {
              grade: student.grade,
              AND: [{ className: student.englishClassName }],
            },
          });

        notifications = [
          ...koreanClassNotifications,
          ...englishClassNotifications,
        ];
      }
    } else {
      notifications = await this.prisma.notifications.findMany({
        where: {
          grade: user.grade,
          OR: [
            { className: user.koreanClassName },
            { className: user.englishClassName },
          ],
        },
      });
    }

    const uniqueNotifications = notifications.filter(
      (v, i, a) =>
        a.findIndex((t) => t.notificationId === v.notificationId) === i
    );

    return uniqueNotifications;
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
