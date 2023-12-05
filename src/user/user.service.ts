import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: number) {
    const result = await this.prisma.users.findFirst({
      where: { userId },
      select: {
        userId: true,
        userName: true,
        grade: true,
        className: true,
        profileUrl: true,
        motto: true,
      },
    });
    return result;
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findFirst({ where: { email } });
  }

  async updateUserInfo(userId: number, body) {
    const result = await this.prisma.users.update({
      where: { userId },
      data: {
        motto: body.motto,
      },
    });

    return result;
  }

  searchUser = async (email: string, name: string) => {
    const result = await this.prisma.users.findMany({
      where: {
        OR: [
          {
            email: {
              contains: email,
            },
          },
          {
            userName: {
              contains: name,
            },
          },
        ],
      },
      select: {
        userId: true,
        grade: true,
        className: true,
        userName: true,
      },
    });
    return result;
  };
}
