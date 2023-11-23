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

  async createSchoolTest(body, userId: number) {
    console.log(body, userId);

    const result = await this.prisma.schoolTests.create({
      data: {
        userId,
        subject: body.subject,
        classHours: +body.classHours,
        score: +body.score,
        rank: +body.rank,
        totalStudent: +body.totalStudent,
        grade: +body.grade,
        testType: +body.testType,
      },
    });

    console.log(result);
    return result;
  }
}
