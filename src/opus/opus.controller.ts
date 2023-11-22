import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
import { ApiBearerTokenHeader } from "src/core/decorator/api-bearer-token-header";
import { OpusService } from "./opus.service";

@Controller("opus")
export class OpusController {
  constructor(private readonly opusService: OpusService) {}

  @UseGuards(BearerTokenGuard)
  @Get()
  @ApiOperation({
    summary: "유저가 참여하는 수업",
  })
  @ApiOkResponse({
    description: "사용자의 수업 가져오기 성공",
  })
  @ApiBearerTokenHeader()
  async getMe(@Req() req, @Query() query) {
    return this.opusService.fetchOpus(req.user.userId, query);
  }
}
