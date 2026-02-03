import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, UuidService } from '../common';
import type { CreateProduct, Product } from 'src/types/product';

@Injectable()
export class ProductCreateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateProduct): Promise<Product> {
    return await this.databaseService.product.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
        isActive: data.isActive ?? true,
      },
    });
  }
}
