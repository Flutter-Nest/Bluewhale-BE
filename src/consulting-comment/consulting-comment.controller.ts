import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
import { ApiBearerTokenHeader } from "src/core/decorator/api-bearer-token-header";
import { ConsultingCommentService } from "./consulting-comment.service";

@Controller("consulting-comment")
export class ConsultingCommentController {
  constructor(
    private readonly consultingCommentService: ConsultingCommentService
  ) {}

  @UseGuards(BearerTokenGuard)
  @Post(":consultingId")
  @ApiOperation({
    summary: "컨설팅 메시지 댓글 생성",
  })
  @ApiOkResponse({
    description: "컨설팅 메시지 댓글 작성 완료",
  })
  @ApiBearerTokenHeader()
  async createConsultingComment(
    @Req() req,
    @Param("consultingId") consultingId,
    @Body() body
  ) {
    return this.consultingCommentService.createConsultingComment(
      +req.user.userId,
      +consultingId,
      body
    );
  }
}
