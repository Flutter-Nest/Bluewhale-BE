import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: number) {
    return this.prisma.users.findFirst({ where: { userId } });
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findFirst({ where: { email } });
  }
}
