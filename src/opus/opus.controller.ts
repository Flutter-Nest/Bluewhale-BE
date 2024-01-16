import { FilesInterceptor } from "@nestjs/platform-express";
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
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
    summary: "사용자가 참여하는 온라인 수업",
  })
  @ApiOkResponse({
    description: "사용자의 온라인 수업 가져오기 성공",
  })
  @ApiBearerTokenHeader()
  async fetchOpus(@Req() req, @Query() query) {
    return this.opusService.fetchOpus(req.user, query);
  }

  @UseGuards(BearerTokenGuard)
  @Post()
  @ApiOperation({
    summary: "온라인 수업 등록",
  })
  @ApiOkResponse({
    description: "온라인 수업 등록 성공",
  })
  @ApiBearerTokenHeader()
  @UseInterceptors(FilesInterceptor("files"))
  async createOpus(
    @Req() req,
    @Body() body,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.opusService.createOpus(req.user.userId, body, files);
  }

  @UseGuards(BearerTokenGuard)
  @Post("/consulting")
  @ApiOperation({
    summary: "컨설팅 일정 등록",
  })
  @ApiOkResponse({
    description: "컨설팅 일정 등록 성공",
  })
  @ApiBearerTokenHeader()
  async createConsulting(@Req() req, @Body() body) {
    return this.opusService.createConsulting(req.user.userId, body);
  }
}
