import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { S3Service } from "src/s3/s3.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async findUserById(userId: number) {
    const result = await this.prisma.users.findFirst({
      where: { userId },
      select: {
        userId: true,
        userName: true,
        grade: true,
        className: true,
        profileUrl: true,
        role: true,
        motto: true,
        isAccepted: true,
        studentId: true,
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

  async signup(body) {
    const existingUser = await this.findUserByEmail(body.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

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

    const phoneNumber = String(body.phoneNumber);
    const privateNumber = phoneNumber.slice(-4);

    const result = await this.prisma.users.create({
      data: {
        userName: body.userName,
        email: body.email,
        password: hashedPassword,
        birth: birthDate.toISOString(),
        phoneNumber: phoneNumber,
        privateNumber: privateNumber,
        school: body.school,
        grade: body.grade,
        role: body.role,
        studentName: body.studentName,
      },
    });

    return result;
  }

  async withdrawalUser(userId: number) {
    const result = await this.prisma.users.delete({
      where: { userId },
    });
    return result;
  }

  async updateProfileImage(userId: number, file: Express.Multer.File) {
    const awsFileKey = `image`;
    const uploadedFile = await this.s3Service.uploadProfileImage(
      awsFileKey,
      file
    );

    await this.prisma.users.update({
      where: { userId: userId },
      data: { profileUrl: uploadedFile.url },
    });

    return { message: "Profile image updated successfully." };
  }

  async notAllowedUser() {
    const result = await this.prisma.users.findMany({
      where: { isAccepted: false },
    });
    return result;
  }

  async allowUser(body) {
    const { userId, grade, className, school, korean, english } = body;

    const result = await this.prisma.users.update({
      where: { userId },
      data: {
        grade,
        className: className.toUpperCase(),
        school,
        korean: korean.toUpperCase(),
        english: english.toUpperCase(),
        isAccepted: true,
      },
    });

    return result;
  }

  async getMember() {
    const result = await this.prisma.users.findMany({
      where: { isAccepted: true },
    });
    return result;
  }

  async updateMember(body) {
    const { userId, grade, className, school, korean, english } = body;

    const result = await this.prisma.users.update({
      where: { userId },
      data: {
        grade,
        className: className.toUpperCase(),
        school,
        korean: korean.toUpperCase(),
        english: english.toUpperCase(),
      },
    });

    return result;
  }
}
