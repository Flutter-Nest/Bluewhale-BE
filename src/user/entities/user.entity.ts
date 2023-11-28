import { ApiProperty } from "@nestjs/swagger";
import { Users } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserEntity implements Users {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: "id", example: "1" })
  userId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: "이름", example: "홍길동" })
  userName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: "비밀번호", example: "asdf1234" })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: "이메일",
    example: "test@test.com",
  })
  email: string;
  grade: number;
  className: string;
  profileUrl: string;
  motto: string;

  birth: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
