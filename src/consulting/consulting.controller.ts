import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
import { ApiBearerTokenHeader } from "src/core/decorator/api-bearer-token-header";
import { ConsultingService } from "./consulting.service";

@Controller("consulting")
export class ConsultingController {
  constructor(private readonly consultingService: ConsultingService) {}

  @UseGuards(BearerTokenGuard)
  @Post()
  @ApiOperation({
    summary: "컨설팅 메시지 생성",
  })
  @ApiOkResponse({
    description: "컨설팅 메시지 생성 성공",
  })
  @ApiBearerTokenHeader()
  async createConsulting(@Req() req, @Body() body) {
    return this.consultingService.createConsulting(req.user.userId, body);
  }

  @UseGuards(BearerTokenGuard)
  @Get()
  @ApiOperation({
    summary: "컨설팅 메시지 전체 조회",
  })
  @ApiOkResponse({
    description: "컨설팅 메시지 전체 조회 성공",
  })
  @ApiBearerTokenHeader()
  async fetchConsultings(@Req() req) {
    return this.consultingService.fetchConsultings(req.user);
  }

  @UseGuards(BearerTokenGuard)
  @Get()
  @ApiOperation({
    summary: "컨설팅 메시지 전체 조회",
  })
  @ApiOkResponse({
    description: "컨설팅 메시지 조회 성공",
  })
  @ApiBearerTokenHeader()
  async fetchStudentConsultings(@Query("studentId") studentId) {
    return this.consultingService.fetchStudentConsultings(studentId);
  }
}
