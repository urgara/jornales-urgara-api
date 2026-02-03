import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListProductsResponse } from 'src/types/product';

class ProductSelectDto {
  @ApiProperty({
    description: 'ID del producto (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Trigo',
  })
  name: string;
}

export class ListProductsResponseDto
  extends GenericDataResponseDto<ProductSelectDto[]>
  implements ListProductsResponse
{
  @ApiProperty({
    description: 'Lista simplificada de productos para selección',
    type: [ProductSelectDto],
  })
  declare data: ProductSelectDto[];
}
