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
    const result = await this.prisma.opus.findMany({
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
        title: true,
        grade: true,
        className: true,
      },
    });
    console.log(result);
    return result;
  }
}
