import { ApiProperty } from '@nestjs/swagger';
import type { Product } from 'src/types/product';

export class ProductResponseDto implements Product {
  @ApiProperty({
    description: 'ID único del producto (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Trigo',
  })
  name: string;

  @ApiProperty({
    description: 'Indica si el producto está activo',
    example: true,
  })
  isActive: boolean;
}
