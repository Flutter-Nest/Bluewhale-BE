import { Injectable } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";
import { CoreService } from "../core/core.service";
import { PaginationDto } from "../core/dto/pagination.dto";
import { Pagination } from "../core/entity/pagination.entity";
import { Restaurant, RestaurantDetail } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(
    private coreService: CoreService,
    private cacheService: CacheService
  ) {}

  paginateRestaurants(paginationDto: PaginationDto): Pagination<Restaurant> {
    const result = this.coreService.paginate(
      this.cacheService.restaurants,
      paginationDto
    );

    return {
      ...result,
      data: result.data.map((item) => new Restaurant(item)),
    };
  }

  getRestaurantById(id: string): RestaurantDetail {
    return this.cacheService.restaurants.find((item) => item.id === id);
  }
}
