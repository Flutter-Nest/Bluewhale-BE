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
        teacher: true,
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
      teacher: item.teacher,
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
}
