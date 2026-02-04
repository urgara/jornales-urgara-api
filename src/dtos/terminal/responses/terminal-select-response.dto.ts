import { ApiProperty } from '@nestjs/swagger';

export class TerminalSelectItemDto {
  @ApiProperty({
    description: 'ID de la terminal',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la terminal',
    example: 'Terminal Central',
  })
  name: string;
}
