import {
  Body,
  Controller,
  Get,
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
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard } from "../auth/bearer-token.guard";
import { ApiPaginatedOkResponseDecorator } from "../core/decorator/api-paginated-ok-response.decorator";
import { PaginationDto } from "../core/dto/pagination.dto";
import { Pagination } from "../core/entity/pagination.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";

@ApiTags("order")
@ApiExtraModels(PaginationDto, Order)
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: "주문 Pagination",
  })
  @ApiPaginatedOkResponseDecorator(Order, {
    description: "Pagination 결과",
  })
  @Get()
  paginateOrder(
    @Request() req,
    @Query() paginationDto: PaginationDto
  ): Pagination<Order> {
    return this.orderService.paginateOrders(req.user, paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({
    summary: "주문 생성하기",
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiOkResponse({
    status: 201,
    type: Order,
  })
  postOrder(@Request() req, @Body() body: CreateOrderDto): Order {
    return this.orderService.postOrder(req.user, body);
  }
}
