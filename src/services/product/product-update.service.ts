import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { ProductId, UpdateProduct, Product } from 'src/types/product';

@Injectable()
export class ProductUpdateService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async update(id: ProductId, data: UpdateProduct): Promise<Product> {
    const product = await this.databaseService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return await this.databaseService.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }
}
