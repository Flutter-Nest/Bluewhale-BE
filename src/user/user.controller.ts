import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BearerTokenGuard } from "../auth/bearer-token.guard";
import { ApiBearerTokenHeader } from "../core/decorator/api-bearer-token-header";
import { UserService } from "./user.service";
import { EmailDto } from "./dto/email.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BearerTokenGuard)
  @Get("me")
  @ApiOperation({
    summary: "토큰을 기준으로 현재 사용자 정보를 가져옵니다.",
  })
  @ApiOkResponse({
    description: "사용자 가져오기 성공",
  })
  @ApiBearerTokenHeader()
  async getMe(@Req() req) {
    return this.userService.findUserById(req.user.userId);
  }

  @UseGuards(BearerTokenGuard)
  @Patch("me")
  @ApiOperation({
    summary: "토큰을 기준으로 현재 사용자 정보를 수정합니다.",
  })
  @ApiOkResponse({
    description: "사용자 정보 수정 성공",
  })
  @ApiBearerTokenHeader()
  async updateUserInfo(@Req() req, @Body() body) {
    return this.userService.updateUserInfo(req.user.userId, body);
  }

  @UseGuards(BearerTokenGuard)
  @Get("search")
  @ApiOperation({
    summary: "유저 검색",
  })
  @ApiOkResponse({
    description: "유저 검색 성공",
  })
  @ApiBearerTokenHeader()
  async searchUser(@Query("email") email: string, @Query("name") name: string) {
    return this.userService.searchUser(email, name);
  }

  @Post("/signup")
  @ApiOperation({
    summary: "회원 가입",
  })
  @ApiOkResponse({
    description: "회원가입 성공",
  })
  @ApiBearerTokenHeader()
  async signup(@Body() body) {
    return this.userService.signup(body);
  }

  @UseGuards(BearerTokenGuard)
  @Delete("/me")
  @ApiOperation({
    summary: "회원 탈퇴",
  })
  @ApiOkResponse({
    description: "회원 탈퇴 성공",
  })
  @ApiBearerTokenHeader()
  async withdrawalUser(@Req() req) {
    return this.userService.withdrawalUser(req.user.userId);
  }

  @Post("/checkEmail")
  @ApiOperation({
    summary: "이메일 중복 확인",
  })
  @ApiOkResponse({
    description: "이메일 중복 확인 성공",
  })
  async checkEmail(@Body() emailDto: EmailDto) {
    const user = await this.userService.findUserByEmail(emailDto.email);
    return { isEmailAvailable: !user };
  }

  @UseGuards(BearerTokenGuard)
  @Put("/profile")
  @UseInterceptors(FileInterceptor("profileImage"))
  async updateProfileImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.updateProfileImage(req.user.userId, file);
  }
}
