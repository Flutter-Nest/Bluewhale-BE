import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
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
}
