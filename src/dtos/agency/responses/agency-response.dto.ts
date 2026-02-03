import { ApiProperty } from '@nestjs/swagger';
import type { Agency } from 'src/types/agency';

export class AgencyResponseDto implements Agency {
  @ApiProperty({
    description: 'ID único de la agencia (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la agencia',
    example: 'Agencia Nacional de Cargas',
  })
  name: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;
}
