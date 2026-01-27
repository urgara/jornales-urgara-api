import { ApiProperty } from '@nestjs/swagger';
import type { Company } from 'src/types/company';

export class CompanyResponseDto implements Company {
  @ApiProperty({
    description: 'ID único de la empresa',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Acme Corporation',
  })
  name: string;

  @ApiProperty({
    description: 'CUIT de la empresa',
    example: '20123456789',
    nullable: true,
  })
  cuit: string | null;

  @ApiProperty({
    description: 'ID de la entidad legal',
    example: 1,
  })
  legalEntityId: number;

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
