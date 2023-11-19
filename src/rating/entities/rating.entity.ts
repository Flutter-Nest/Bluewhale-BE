import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { BaseEntity } from "../../core/entity/base.entity";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";

export class Rating extends BaseEntity {
  constructor(params: Rating) {
    super(params);

    Object.assign(this, params);
  }

  @ApiProperty({
    name: "user",
    description: "평점 작성한 유저",
    // type: User,
  })
  user;

  @Exclude()
  restaurant: Restaurant;

  @ApiProperty({
    name: "rating",
    example: 5,
    description: "평점",
  })
  rating: number;

  @ApiProperty({
    name: "content",
    description: "평가 내용",
    example: "너무 맛있어요~",
  })
  content: string;

  @Transform(({ value }) => value.map((item) => `/img/${item}`))
  @ApiProperty({
    isArray: true,
    type: String,
    name: "imgUrls",
    description: "이미지 URL",
    example: ["/img/test.png"],
  })
  imgUrls: string[];
}
