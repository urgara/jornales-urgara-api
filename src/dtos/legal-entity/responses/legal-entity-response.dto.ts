import { ApiProperty } from '@nestjs/swagger';
import type { LegalEntity } from 'src/types/legal-entity';

export class LegalEntityResponseDto implements LegalEntity {
  @ApiProperty({
    description: 'ID único de la entidad legal',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Abreviación de la entidad legal',
    example: 'S.A.',
    maxLength: 15,
  })
  abbreviation: string;

  @ApiProperty({
    description: 'Descripción completa de la entidad legal',
    example: 'Sociedad Anónima',
    maxLength: 150,
  })
  description: string;

  @ApiProperty({
    description: 'Si sigue en uso este tipo de entidad',
    example: true,
  })
  isActive: boolean;
}
