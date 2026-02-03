import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { ProductId } from 'src/types/product';

@Injectable()
export class ProductDeleteService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async delete(id: ProductId): Promise<void> {
    const product = await this.databaseService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Hard delete (Product doesn't have deletedAt field)
    await this.databaseService.product.delete({
      where: { id },
    });
  }
}
