import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import type { UpdateProduct } from 'src/types/product';

export class UpdateProductDto
  extends PartialType(CreateProductDto)
  implements UpdateProduct {}
