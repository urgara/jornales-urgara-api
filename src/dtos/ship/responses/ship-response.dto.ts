import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Ship } from 'src/types/ship';

export class ShipResponseDto implements Ship {
  @ApiProperty({
    description: 'ID único del barco',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nombre del barco',
    example: 'SS Atlantic',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación',
    example: null,
    nullable: true,
  })
  @Expose()
  deletedAt: Date;
}
