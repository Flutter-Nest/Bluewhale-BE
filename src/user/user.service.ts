import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: number) {
    return this.prisma.users.findFirst({ where: { userId } });
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findFirst({ where: { email } });
  }

  // getBasket(userId: string): BasketItemWithFullProductDto[] {
  //   return this.cacheService.users.find((x) => x.id === userId).basket;
  // }

  // addToBasket(
  //   userId: string,
  //   products: BasketItemDto[]
  // ): BasketItemWithFullProductDto[] {
  //   const user = this.cacheService.users.find((x) => x.id === userId);

  //   user.basket = this._mapBasketDtoToProduct(products);

  //   return user.basket;
  // }

  // _mapBasketDtoToProduct(products: BasketItemDto[]) {
  //   const allProducts = this.cacheService.products;

  //   return products.map((dto) => ({
  //     product: allProducts.find((product) => product.id === dto.productId),
  //     count: dto.count,
  //   }));
  // }
}
