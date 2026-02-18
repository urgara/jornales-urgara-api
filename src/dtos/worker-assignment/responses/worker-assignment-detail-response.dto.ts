import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { DecimalNumber } from 'src/types/common';
import type { SimpleWorkerAssignmentDetailResponse } from 'src/types/worker-assignment';
import { Category } from 'generated/prisma-locality';

export class WorkerAssignmentDetailResponseDto
  implements SimpleWorkerAssignmentDetailResponse
{
  @ApiProperty({
    description: 'ID del detalle',
    example: '550e8400-e29b-41d4-a716-446655440010',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la asignación (header)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  workerAssignmentId: string;

  @ApiProperty({
    description: 'ID del trabajador',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  workerId: string;

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
    description: 'Valor bruto: calculatedValue.gross (si JC: * 0.70)',
    example: '12000.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value.toString())
  gross: string;

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
    description:
      'Valor neto: calculatedValue.net (si JC: * 0.70) + porcentaje adicional',
    example: '13800.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value.toString())
  net: string;
}
