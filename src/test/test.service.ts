import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}
  async fetchSchoolTests(userId: number) {
    const result = await this.prisma.schoolTests.findMany({
      where: {
        userId,
      },
    });
    console.log(result);
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

  async fetchMockTests(userId: number) {
    const result = await this.prisma.mockTests.findMany({
      where: {
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

  async updateMockTest(body, userId, mockTestId) {
    const result = await this.prisma.mockTests.update({
      where: {
        id: mockTestId,
      },
      data: {
        month: +body.month,
        originalScore: +body.originalScore,
        standardScore: +body.standardScore,
        rank: +body.rank,
        percentage: +body.totalStudent,
      },
    });

    return result;
  }

  async deleteMockTest(userId, mockTestId) {
    const result = await this.prisma.mockTests.delete({
      where: {
        id: mockTestId,
      },
    });

    return result;
  }
}
