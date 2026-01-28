import { ApiProperty } from '@nestjs/swagger';

export class WorkerSelectItemDto {
  @ApiProperty({
    description: 'ID del trabajador',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del trabajador',
    example: 'Juan',
  })
  name: string;

  @ApiProperty({
    description: 'Apellido del trabajador',
    example: 'Pérez',
  })
  surname: string;

  @ApiProperty({
    description: 'DNI del trabajador',
    example: '12345678',
  })
  dni: string;
}
