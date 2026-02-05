import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import type { UpdateProduct } from 'src/types/product';

export class UpdateProductDto
  extends PartialType(CreateProductDto)
  implements UpdateProduct
{
  @ApiProperty({
    description:
      'Indica si el producto está activo (solo se puede cambiar en update)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
