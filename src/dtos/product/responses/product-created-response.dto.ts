import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ProductCreatedResponse } from 'src/types/product';
import { ProductResponseDto } from './product-response.dto';

export class ProductCreatedResponseDto
  extends GenericDataResponseDto<ProductResponseDto>
  implements ProductCreatedResponse
{
  @ApiProperty({
    description: 'Datos del producto creado',
    type: ProductResponseDto,
  })
  declare data: ProductResponseDto;
}
