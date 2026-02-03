import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ProductSingleResponse } from 'src/types/product';
import { ProductResponseDto } from './product-response.dto';

export class ProductSingleResponseDto
  extends GenericDataResponseDto<ProductResponseDto>
  implements ProductSingleResponse
{
  @ApiProperty({
    description: 'Datos del producto',
    type: ProductResponseDto,
  })
  declare data: ProductResponseDto;
}
