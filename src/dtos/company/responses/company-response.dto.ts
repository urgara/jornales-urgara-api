import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Company } from 'src/types/company';

export class CompanyResponseDto implements Company {
  @ApiProperty({
    description: 'ID único de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Acme Corporation',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'CUIT de la empresa',
    example: '20123456789',
    nullable: true,
  })
  @Expose()
  cuit: string;

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
