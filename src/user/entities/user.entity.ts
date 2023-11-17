import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { BaseEntity } from "../../core/entity/base.entity";
import { BasketItemWithFullProductDto } from "../dto/basket-item.dto";

export class User extends BaseEntity {
  constructor(params: User) {
    super(params);

    Object.assign(this, params);
  }

  @ApiProperty({
    name: "username",
    description: "사용자 이메일",
    example: "test@test.com",
  })
  username: string;

  @Transform(({ value }) => `/img/${value}`)
  @ApiProperty({
    name: "imageUrl",
    description: "프로필 이미지 URL",
    example: "/img/logo.png",
  })
  imageUrl: string;

  @Exclude()
  basket: BasketItemWithFullProductDto[];

  @Exclude()
  password: string;
}
