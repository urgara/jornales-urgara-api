import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { DecimalNumber } from 'src/types/common';
import type { SimpleWorkerAssignmentResponse } from 'src/types/worker-assignment';
import { Category } from 'generated/prisma-locality';

export class WorkerAssignmentResponseDto
  implements SimpleWorkerAssignmentResponse
{
  @ApiProperty({
    description: 'ID de la asignación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del trabajador',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  workerId: string;

  @ApiProperty({
    description: 'ID del turno de trabajo',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
  })
  workShiftId: string;

  @ApiProperty({
    description: 'Fecha de la asignación',
    example: '2024-01-15',
  })
  @Transform(({ value }: { value: Date }) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split('T')[0];
  })
  date: string;

  @ApiProperty({
    description: 'Categoría del trabajador en el momento de la asignación',
    example: 'IDONEO',
    enum: Category,
  })
  category: Category;

  @ApiProperty({
    description: 'ID del valor base usado para el cálculo',
    example: '345e6789-e89b-12d3-a456-426614174002',
  })
  workShiftBaseValueId: string;

  @ApiProperty({
    description: 'Coeficiente usado para el cálculo',
    example: '1.50',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value.toString())
  coefficient: string;

  @ApiProperty({
    description: 'Valor base calculado desde WorkShiftCalculatedValue',
    example: '12000.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value.toString())
  baseValue: string;

  @ApiProperty({
    description: 'Porcentaje adicional (puede ser positivo o negativo)',
    example: '15.00',
    nullable: true,
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | null | undefined }) =>
    value ? value.toString() : null,
  )
  additionalPercent: string;

  @ApiProperty({
    description: 'Monto bruto total con el porcentaje aplicado si existiera',
    example: '13800.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value.toString())
  totalAmount: string;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  companyId: string;

  @ApiProperty({
    description: 'ID de la localidad',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  localityId: string;

  @ApiProperty({
    description: 'ID de la agencia',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  agencyId: string;

  @ApiProperty({
    description: 'ID de la terminal',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  terminalId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  productId: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;
}
