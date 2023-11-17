import { Injectable } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";
import { CoreService } from "../core/core.service";
import { PaginationDto } from "../core/dto/pagination.dto";
import { Pagination } from "../core/entity/pagination.entity";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductService {
  constructor(
    private cacheService: CacheService,
    private coreService: CoreService
  ) {}

  getAllProducts(): Product[] {
    return this.cacheService.products;
  }

  getProductById(id: string): Product {
    return this.cacheService.products.find((item) => item.id === id);
  }

  paginateProducts(paginationDto: PaginationDto): Pagination<Product> {
    const result = this.coreService.paginate<Product>(
      this.cacheService.products,
      paginationDto
    );

    return {
      ...result,
      data: result.data.map((item) => new Product(item)),
    };
  }
}
