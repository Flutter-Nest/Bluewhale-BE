import { BearerTokenGuard } from "./../auth/bearer-token.guard";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(BearerTokenGuard)
  @Post()
  async createAttendance(@Req() req, @Body() body) {
    const result = await this.attendanceService.createAttendance(
      req.user.userId,
      body
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Get()
  async fetchAttendances(@Req() req) {
    const result = await this.attendanceService.fetchAttendances(
      req.user.userId
    );
    return result;
  }
}
