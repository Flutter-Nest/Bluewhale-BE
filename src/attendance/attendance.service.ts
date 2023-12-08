import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}
  async createAttendance(userId: number, body) {
    const user = await this.prisma.users.findFirst({
      where: {
        privateNumber: +body.privateNumber,
      },
      select: {
        userId: true,
      },
    });

    const result = await this.prisma.attendances.create({
      data: {
        userId: user.userId,
        onLink: body.onLink,
      },
    });

    return result;
  }

  async fetchAttendances(userId: number) {
    const result = await this.prisma.attendances.findMany({
      where: {
        userId,
      },
    });

    return result;
  }
}
