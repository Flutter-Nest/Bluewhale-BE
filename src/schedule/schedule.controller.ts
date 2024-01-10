import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
import { ScheduleService } from "./schedule.service";

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(BearerTokenGuard)
  @Post()
  async createSchedule(@Req() req, @Body() body) {
    const result = await this.scheduleService.createSchedule(
      req.user.userId,
      body
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Patch(":scheduleId")
  async updateSchedule(@Param("scheduleId") scheduleId, @Body() body) {
    const result = await this.scheduleService.updateSchedule(+scheduleId, body);
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Delete(":scheduleId")
  async deleteSchedule(@Param("scheduleId") scheduleId) {
    await this.scheduleService.deleteSchedule(+scheduleId);
    return { message: "Schedule deleted successfully" };
  }

  @UseGuards(BearerTokenGuard)
  @Get("/color")
  async fetchColors() {
    const result = await this.scheduleService.fetchColors();
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Get()
  async fetchSchedules(@Req() req, @Query() query) {
    const result = await this.scheduleService.fetchSchedules(req.user);
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Get(":scheduleId")
  async fetchOneSchedule(@Param("scheduleId") scheduleId) {
    const result = await this.scheduleService.fetchOneSchedule(+scheduleId);
    return result;
  }
}
