import { Module } from '@nestjs/common';
import { ProductController } from 'src/controllers/product.controller';
import {
  ProductCreateService,
  ProductDeleteService,
  ProductReadService,
  ProductUpdateService,
} from 'src/services/product';

@Module({
  controllers: [ProductController],
  providers: [
    ProductCreateService,
    ProductDeleteService,
    ProductReadService,
    ProductUpdateService,
  ],
  exports: [ProductReadService],
})
export class ProductModule {}
