import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheService } from "../cache/cache.service";
import {
  BasketItemDto,
  BasketItemWithFullProductDto,
} from "./dto/basket-item.dto";

@Injectable()
export class UserService {
  constructor(
    private cacheService: CacheService,
    private prisma: PrismaService
  ) {}

  async findUserById(userId: number) {
    return this.prisma.users.findFirst({ where: { userId } });
  }

  getBasket(userId: string): BasketItemWithFullProductDto[] {
    return this.cacheService.users.find((x) => x.id === userId).basket;
  }

  addToBasket(
    userId: string,
    products: BasketItemDto[]
  ): BasketItemWithFullProductDto[] {
    const user = this.cacheService.users.find((x) => x.id === userId);

    user.basket = this._mapBasketDtoToProduct(products);

    return user.basket;
  }

  _mapBasketDtoToProduct(products: BasketItemDto[]) {
    const allProducts = this.cacheService.products;

    return products.map((dto) => ({
      product: allProducts.find((product) => product.id === dto.productId),
      count: dto.count,
    }));
  }
}
