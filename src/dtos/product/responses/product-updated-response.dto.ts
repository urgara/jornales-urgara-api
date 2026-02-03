import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ProductUpdatedResponse } from 'src/types/product';
import { ProductResponseDto } from './product-response.dto';

export class ProductUpdatedResponseDto
  extends GenericDataResponseDto<ProductResponseDto>
  implements ProductUpdatedResponse
{
  @ApiProperty({
    description: 'Datos del producto actualizado',
    type: ProductResponseDto,
  })
  declare data: ProductResponseDto;
}
