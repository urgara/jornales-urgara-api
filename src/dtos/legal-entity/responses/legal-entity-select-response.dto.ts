import { ApiProperty } from '@nestjs/swagger';

export class LegalEntitySelectItemDto {
  @ApiProperty({
    description: 'ID de la entidad legal',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Abreviación de la entidad legal',
    example: 'S.A.',
  })
  abbreviation: string;

  @ApiProperty({
    description: 'Descripción de la entidad legal',
    example: 'Sociedad Anónima',
  })
  description: string;
}
