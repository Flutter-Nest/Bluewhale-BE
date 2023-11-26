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
  @Get("/school")
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
  @Post("/school")
  async createSchoolTest(@Body() body, @Req() req) {
    console.log(body);
    const result = await this.testService.createSchoolTest(
      body,
      req.user.userId
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Patch("/school/:schoolTestId")
  async updateSchoolTest(
    @Body() body,
    @Req() req,
    @Param("schoolTestId") schoolTestId
  ) {
    const result = await this.testService.updateSchoolTest(
      body,
      req.user.userId,
      +schoolTestId
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Delete("/school/:schoolTestId")
  async deleteSchoolTest(@Req() req, @Param("schoolTestId") schoolTestId) {
    const result = await this.testService.deleteSchoolTest(
      req.user.userId,
      +schoolTestId
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Get("/mock")
  async fetchMockTests(
    @Req() req,
    @Query("grade") grade,
    @Query("subject") subject
  ) {
    const result = await this.testService.fetchMockTests(
      +grade,
      +subject,
      req.user.userId
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Post("/mock")
  async createMockTest(@Body() body, @Req() req) {
    console.log(body);
    const result = await this.testService.createMockTest(body, req.user.userId);
    return result;
  }
}
