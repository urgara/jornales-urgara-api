import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { DecimalNumber } from 'src/types/common';
import type { SimpleWorkerAssignmentResponse } from 'src/types/worker-assignment';

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
    description: 'Porcentaje adicional',
    example: '15.00',
    nullable: true,
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | null | undefined }) =>
    value ? value.toString() : null,
  )
  additionalPercent: string;

  @ApiProperty({
    description: 'Monto total calculado',
    example: '12000.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  totalAmount: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;
}
