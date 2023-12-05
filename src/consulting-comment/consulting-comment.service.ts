import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ConsultingCommentService {
  constructor(private prisma: PrismaService) {}
  async createConsultingComment(userId: number, consultingId: number, body) {
    const result = await this.prisma.consultingComments.create({
      data: {
        userId,
        consultingId,
        content: body.content,
      },
    });

    return result;
  }
}
