import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/bearer-token.guard";
import { ApiBearerTokenHeader } from "../core/decorator/api-bearer-token-header";
import { ApiPaginatedOkResponseDecorator } from "../core/decorator/api-paginated-ok-response.decorator";
import { PaginationDto } from "../core/dto/pagination.dto";
import { Pagination } from "../core/entity/pagination.entity";
import { CreateRatingDto } from "../rating/dto/create-rating.dto";
import { Rating } from "../rating/entities/rating.entity";
import { RatingService } from "../rating/rating.service";
import { Restaurant, RestaurantDetail } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurant.service";

@ApiTags("restaurant")
@ApiExtraModels(Pagination, Restaurant, Rating)
@Controller("restaurant")
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly ratingService: RatingService
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({
    summary: "레스토랑을 Pagination합니다.",
  })
  @ApiPaginatedOkResponseDecorator(Restaurant, {
    description: "레스토랑 Pagination 결과값",
  })
  @ApiBearerTokenHeader()
  paginateRestaurants(
    @Query() paginationDto: PaginationDto
  ): Pagination<Restaurant> {
    return this.restaurantService.paginateRestaurants(paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":rid")
  @ApiOperation({
    summary: "레스토랑 정보 가져오기",
  })
  @ApiOkResponse({
    description: "레스토랑 정보 가져오기 성공",
    type: RestaurantDetail,
  })
  @ApiParam({
    name: "rid",
    description: "레스토랑 ID",
    example: "1952a209-7c26-4f50-bc65-086f6e64dbbd",
  })
  @ApiBearerTokenHeader()
  getRestaurant(@Param("rid") id: string): RestaurantDetail {
    const restaurant = this.restaurantService.getRestaurantById(id);

    if (!restaurant) {
      throw new NotFoundException("존재하지 않는 ID입니다.");
    }

    return restaurant;
  }

  @UseGuards(AccessTokenGuard)
  @Get(":rid/rating")
  @ApiOperation({
    summary: "레스토랑 평점 Pagination",
  })
  @ApiPaginatedOkResponseDecorator(Rating, {
    description: "Pagination 결과",
  })
  @ApiParam({
    name: "rid",
    description: "레스토랑 ID",
    example: "1952a209-7c26-4f50-bc65-086f6e64dbbd",
  })
  @ApiBearerTokenHeader()
  paginateRestaurantRatings(
    @Param("rid") id: string,
    @Query() paginationDto: PaginationDto
  ): Pagination<Rating> {
    return this.ratingService.paginateRestaurantRatings(id, paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":rid/rating")
  @ApiOperation({
    summary: "레스토랑 평점 생성하기",
  })
  @ApiOkResponse({
    status: 201,
    description: "생성된 평점",
    type: Rating,
  })
  @ApiBody({
    type: CreateRatingDto,
  })
  @ApiParam({
    name: "rid",
    description: "레스토랑 ID",
    example: "1952a209-7c26-4f50-bc65-086f6e64dbbd",
  })
  @ApiBearerTokenHeader()
  postRestaurantRating(
    @Param("rid") id: string,
    @Request() req,
    @Body() body: CreateRatingDto
  ): Rating {
    return this.ratingService.createRestaurantRating(req.user, id, body);
  }
}
