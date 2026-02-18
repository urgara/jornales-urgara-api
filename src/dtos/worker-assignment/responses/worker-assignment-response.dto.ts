import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import type { SimpleWorkerAssignmentResponse } from 'src/types/worker-assignment';
import { WorkerAssignmentDetailResponseDto } from './worker-assignment-detail-response.dto';
import { CompanyRole } from 'generated/prisma-locality';

export class WorkerAssignmentResponseDto
  implements SimpleWorkerAssignmentResponse
{
  @ApiProperty({
    description: 'ID de la asignación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

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
    description: 'ID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  companyId: string;

  @ApiProperty({
    description: 'Rol de la empresa en la asignación',
    example: 'EXPORTER',
    enum: CompanyRole,
  })
  companyRole: CompanyRole;

  @ApiProperty({
    description: 'ID de la localidad',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  localityId: string;

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
    description: 'ID del barco',
    example: '550e8400-e29b-41d4-a716-446655440006',
  })
  shipId: string;

  @ApiProperty({
    description: 'Nombre del barco',
    example: 'MSC Flaminia',
  })
  shipName: string;

  @ApiProperty({
    description: 'Jornal caído',
    example: false,
  })
  jc: boolean;

  @ApiProperty({
    description: 'Indica si la asignación está cerrada',
    example: false,
  })
  isClosed: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Detalles de los trabajadores asignados',
    type: [WorkerAssignmentDetailResponseDto],
  })
  @Type(() => WorkerAssignmentDetailResponseDto)
  workers: WorkerAssignmentDetailResponseDto[];
}
