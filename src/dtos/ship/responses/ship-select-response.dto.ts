import { ApiProperty } from '@nestjs/swagger';

export class ShipSelectItemDto {
  @ApiProperty({
    description: 'ID del barco',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del barco',
    example: 'SS Atlantic',
  })
  name: string;
}
