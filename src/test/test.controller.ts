import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
import { TestService } from "./test.service";

@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(BearerTokenGuard)
  @Get()
  async fetchSchoolTests(
    @Req() req,
    @Query("grade") grade,
    @Query("testType") testType
  ) {
    const result = await this.testService.fetchSchoolTests(
      +grade,
      +testType,
      req.user.userId
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Post()
  async createSchoolTest(@Body() body, @Req() req) {
    console.log(body);
    const result = await this.testService.createSchoolTest(
      body,
      req.user.userId
    );
    return result;
  }
}
