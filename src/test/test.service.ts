import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}
  async fetchSchoolTests(grade: number, testType: number, userId: number) {
    const result = await this.prisma.schoolTests.findMany({
      where: {
        grade,
        testType,
        userId,
      },
    });
    return result;
  }
}
