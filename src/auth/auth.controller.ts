import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  ApiBasicTokenHeader,
  ApiBearerTokenHeader,
} from "../core/decorator/api-bearer-token-header";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { BasicTokenGuard } from "./basic-token.guard";
import { RefreshTokenGuard } from "./bearer-token.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({
    summary: "Login하기",
  })
  @ApiBasicTokenHeader()
  @ApiOkResponse({
    description: "Access Token과 Refresh Token",
    schema: {
      properties: {
        accessToken: {
          type: "string",
          example: "asdiofjzxl;ckvjoiasjewr.asdfoiasjdflkajsdf.asdfivjiaosdjf",
          description: "Access Token",
        },
        refreshToken: {
          type: "string",
          example: "asdiofjzxl;ckvjoiasjewr.asdfoiasjdflkajsdf.asdfivjiaosdjf",
          description: "Refresh Token",
        },
      },
    },
  })
  @UseGuards(BasicTokenGuard)
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @Post('register')
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.createUser(createUserDto);
  // }

  @ApiOperation({
    summary: "Token Refresh하기",
  })
  @ApiBearerTokenHeader()
  @ApiOkResponse({
    description: "Access Token",
    schema: {
      properties: {
        accessToken: {
          type: "string",
          example: "asdiofjzxl;ckvjoiasjewr.asdfoiasjdflkajsdf.asdfivjiaosdjf",
          description: "Access Token",
        },
      },
    },
  })
  @UseGuards(RefreshTokenGuard)
  @Post("token")
  async token(@Request() req) {
    return {
      accessToken: await this.authService.rotateAccessToken(req.token),
    };
  }
}
