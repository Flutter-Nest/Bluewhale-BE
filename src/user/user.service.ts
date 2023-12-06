import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: number) {
    const result = await this.prisma.users.findFirst({
      where: { userId },
      select: {
        userId: true,
        userName: true,
        grade: true,
        className: true,
        profileUrl: true,
        motto: true,
      },
    });
    return result;
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findFirst({ where: { email } });
  }

  async updateUserInfo(userId: number, body) {
    const result = await this.prisma.users.update({
      where: { userId },
      data: {
        motto: body.motto,
      },
    });

    return result;
  }

  searchUser = async (email: string, name: string) => {
    const result = await this.prisma.users.findMany({
      where: {
        OR: [
          {
            email: {
              contains: email,
            },
          },
          {
            userName: {
              contains: name,
            },
          },
        ],
      },
      select: {
        userId: true,
        grade: true,
        className: true,
        userName: true,
      },
    });
    return result;
  };

  async signupStudent(body) {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    let birthDate;
    try {
      birthDate = new Date(body.birth);
      if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid birth date");
      }
    } catch (e) {
      console.error(e);
      throw new Error("Invalid birth date format");
    }

    const birthYear = birthDate.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    let grade;
    if (age === 16) {
      grade = 1;
    } else if (age === 17) {
      grade = 2;
    } else if (age === 18) {
      grade = 3;
    }

    const result = await this.prisma.users.create({
      data: {
        userName: body.userName,
        email: body.email,
        password: hashedPassword,
        birth: birthDate.toISOString(),
        phoneNumber: body.phoneNumber,
        school: body.school,
        grade,
        role: "student",
      },
    });

    return result;
  }
}
