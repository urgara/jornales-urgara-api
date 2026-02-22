import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkerAssignmentResponseDto } from './worker-assignment-response.dto';
import { WorkerAssignmentDetailWithWorkerResponseDto } from './worker-assignment-detail-with-worker-response.dto';
import { WorkShiftResponseDto } from 'src/dtos/work-shift/responses';

export class WorkerAssignmentWithRelationsDto extends WorkerAssignmentResponseDto {
  @ApiProperty({
    description: 'Detalles de los trabajadores asignados con datos del worker',
    type: [WorkerAssignmentDetailWithWorkerResponseDto],
  })
  @Type(() => WorkerAssignmentDetailWithWorkerResponseDto)
  declare workers: WorkerAssignmentDetailWithWorkerResponseDto[];

  @ApiProperty({
    description: 'Datos del turno',
    type: WorkShiftResponseDto,
  })
  WorkShift: WorkShiftResponseDto;
}
