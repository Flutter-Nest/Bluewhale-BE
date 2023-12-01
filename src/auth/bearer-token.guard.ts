import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const rawToken = request.headers["authorization"];
    if (!rawToken) {
      throw new UnauthorizedException("토큰이 없습니다.");
    }

    const splitToken = rawToken.split(" ");

    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
      throw new UnauthorizedException("잘못된 토큰입니다.");
    }

    const token = splitToken[1];
    let payload;
    try {
      payload = await this.authService.verifyToken(token);
    } catch (e) {
      throw new UnauthorizedException("잘못된 토큰입니다.");
    }

    if (!payload.userId) {
      throw new UnauthorizedException("잘못된 토큰입니다.");
    }

    request.user = await this.userService.findUserById(payload.userId);
    request.token = token;
    request.tokenType = payload.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== "access") {
      throw new UnauthorizedException("Access Token이 아닙니다.");
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== "refresh") {
      throw new UnauthorizedException("Refresh Token이 아닙니다.");
    }

    return true;
  }
}
