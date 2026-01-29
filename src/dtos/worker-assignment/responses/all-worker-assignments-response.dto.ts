import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkerAssignmentResponseDto } from './worker-assignment-response.dto';
import { PaginationResponseDto } from 'src/dtos/common';

export class AllWorkerAssignmentsResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Worker assignments retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Lista de asignaciones',
    type: [WorkerAssignmentResponseDto],
  })
  @Type(() => WorkerAssignmentResponseDto)
  data: WorkerAssignmentResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationResponseDto,
  })
  @Type(() => PaginationResponseDto)
  pagination: PaginationResponseDto;
}
