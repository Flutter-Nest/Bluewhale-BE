import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  verifyToken(token: string) {
    const result = this.jwtService.verify(token);
    return result;
  }

  async rotateAccessToken(refreshToken: string): Promise<string> {
    const decoded = this.jwtService.verify(refreshToken);

    return this.signToken(
      {
        username: decoded.username,
        userId: decoded.userId,
      },
      false
    );
  }

  signToken(user: any, isRefreshToken: boolean): string {
    const payload = {
      username: user.userName,
      userId: user.userId,
      type: isRefreshToken ? "refresh" : "access",
    };

    return this.jwtService.sign(payload, {
      expiresIn: isRefreshToken ? "1d" : "300s",
    });
  }

  async authenticate(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return new ForbiddenException("아이디 또는 비밀번호를 확인해주세요");
    }

    if (user.password !== password) {
      return new ForbiddenException("아이디 또는 비밀번호를 확인해주세요");
    }

    return user;
  }

  async login(user) {
    return {
      refreshToken: this.signToken(user, true),
      accessToken: this.signToken(user, false),
    };
  }
}
