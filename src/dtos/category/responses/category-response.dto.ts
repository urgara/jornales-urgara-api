import { ApiProperty } from '@nestjs/swagger';
import type { Category } from 'src/types/category';

export class CategoryResponseDto implements Category {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la categoría del perito',
    example: 'Perito Senior',
  })
  name: string;

  @ApiProperty({
    description: 'Indica si es una categoría especial que aplica a todos los turnos',
    example: false,
  })
  isSpecial: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;
}
