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

    return result;
  }

  async updateSchoolTest(body, userId, schoolTestId) {
    const result = await this.prisma.schoolTests.update({
      where: {
        id: schoolTestId,
      },
      data: {
        subject: body.subject,
        classHours: +body.classHours,
        score: +body.score,
        rank: +body.rank,
        totalStudent: +body.totalStudent,
      },
    });

    return result;
  }

  async deleteSchoolTest(userId, schoolTestId) {
    const result = await this.prisma.schoolTests.delete({
      where: {
        id: schoolTestId,
      },
    });

    return result;
  }

  async fetchMockTests(grade: number, subject: number, userId: number) {
    const result = await this.prisma.mockTests.findMany({
      where: {
        grade,
        subject,
        userId,
      },
    });
    return result;
  }

  async createMockTest(body, userId: number) {
    const result = await this.prisma.mockTests.create({
      data: {
        userId,
        month: +body.month,
        subject: body.subject,
        rank: +body.rank,
        grade: +body.grade,
        percentage: +body.percentage,
        originalScore: +body.originalScore,
        standardScore: +body.standardScore,
      },
    });

    return result;
  }
}
