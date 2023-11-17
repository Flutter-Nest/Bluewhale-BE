import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { CacheService } from "../cache/cache.service";
import { CoreService } from "../core/core.service";
import { PaginationDto } from "../core/dto/pagination.dto";
import { Pagination } from "../core/entity/pagination.entity";
import { CreateRestaurantRatingDto } from "../restaurant/dto/create-restaurant-rating.dto";
import { User } from "../user/entities/user.entity";
import { Rating } from "./entities/rating.entity";

@Injectable()
export class RatingService {
  constructor(
    private coreService: CoreService,
    private cacheService: CacheService
  ) {}

  paginateRatings(paginationDto: PaginationDto): Pagination<Rating> {
    return this.coreService.paginate(this.cacheService.ratings, paginationDto);
  }

  paginateRestaurantRatings(
    restaurantId: string,
    paginationDto: PaginationDto
  ): Pagination<Rating> {
    return this.coreService.paginate(
      this.cacheService.ratings.filter((x) => x.restaurant.id === restaurantId),
      paginationDto
    );
  }

  createRestaurantRating(
    user: User,
    restaurantId: string,
    createRatingDto: CreateRestaurantRatingDto
  ): Rating {
    const restaurant = this.cacheService.restaurants.find(
      (x) => x.id === restaurantId
    );

    const imgUrls = [];

    for (const img of createRatingDto.imageNames) {
      fs.renameSync(
        path.join(process.cwd(), "public", "uploads", img),
        path.join(process.cwd(), "public", "img", "ratings", img)
      );

      imgUrls.push(path.join("ratings", img));
    }

    const newRating = new Rating({
      id: uuid(),
      user,
      restaurant,
      rating: createRatingDto.rating,
      content: createRatingDto.content,
      imgUrls: imgUrls,
    });

    this.cacheService.ratings = [newRating, ...this.cacheService.ratings];

    return newRating;
  }
}
