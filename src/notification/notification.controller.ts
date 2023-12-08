import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BearerTokenGuard } from "src/auth/bearer-token.guard";
import { NotificationService } from "./notification.service";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(BearerTokenGuard)
  @Post()
  async createNotification(@Req() req, @Body() body) {
    const result = await this.notificationService.createNotification(
      req.user.userId,
      body
    );
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Get()
  async fetchNotifications(@Req() req) {
    const result = await this.notificationService.fetchNotifications(req.user);
    return result;
  }

  @UseGuards(BearerTokenGuard)
  @Put(":id/read")
  async updateIsRead(@Req() req, @Param("id") id) {
    const result = await this.notificationService.updateIsRead(+id);
    return result;
  }
}
