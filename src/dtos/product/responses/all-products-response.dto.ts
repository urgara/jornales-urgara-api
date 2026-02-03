import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllProductsResponse } from 'src/types/product';
import { ProductResponseDto } from './product-response.dto';

export class AllProductsResponseDto
  extends GenericDataResponseDto<ProductResponseDto[]>
  implements AllProductsResponse
{
  @ApiProperty({
    description: 'Lista de productos',
    type: [ProductResponseDto],
  })
  declare data: ProductResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
