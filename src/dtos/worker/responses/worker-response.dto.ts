import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { SimpleWorkerResponse } from 'src/types/worker';
import { Category } from 'src/types/worker';
import type { DecimalNumber } from 'src/types/common';

export class WorkerResponseDto implements SimpleWorkerResponse {
  @ApiProperty({
    description: 'ID único del trabajador (UUID)',
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

  @ApiProperty({
    description: 'ID de la localidad (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  localityId: string;

  @ApiProperty({
    description: 'Categoría del trabajador',
    example: 'IDONEO',
    enum: Category,
  })
  category: Category;

  @ApiProperty({
    description: 'Tarifa base por hora del trabajador',
    example: '1500.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  baseHourlyRate: string;

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
