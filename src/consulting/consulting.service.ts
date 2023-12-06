import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ConsultingService {
  constructor(private prisma: PrismaService) {}
  async createConsulting(userId: number, body) {
    const result = this.prisma.consultings.create({
      data: {
        content: body.content,
        studentId: body.studentId,
        consultantId: userId,
        startDate: body.startDate,
        endDate: body.endDate,
      },
    });

    return result;
  }

  async fetchConsultings(userId: number, query) {
    const rawResult = await this.prisma.consultings.findMany({
      where: {
        studentId: +query.studentId,
      },
      select: {
        consultingId: true,
        Consultant: true,
        Student: true,
        content: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        ConsultingComments: {
          include: {
            Users: true,
          },
        },
      },
    });

    const result = rawResult.map((result) => ({
      consultingId: result.consultingId,
      consultant: result.Consultant.userName,
      student: result.Student.userName,
      grade: result.Student.grade,
      className: result.Student.className,
      content: result.content,
      startDate: result.startDate,
      endDate: result.endDate,
      createdAt: result.createdAt,
      comments: result.ConsultingComments.map((comment) => ({
        consultingCommentId: comment.consultingCommentId,
        consultingId: comment.consultingId,
        userId: comment.userId,
        userName: comment.Users.userName,
        profileUrl: comment.Users.profileUrl,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
    }));

    return result;
  }
}
