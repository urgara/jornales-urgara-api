import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import { WorkerAssignmentResponseDto } from './worker-assignment-response.dto';
import type { WorkerAssignmentUpdatedResponse } from 'src/types/worker-assignment';

export class WorkerAssignmentUpdatedResponseDto
  extends GenericDataResponseDto<WorkerAssignmentResponseDto>
  implements WorkerAssignmentUpdatedResponse
{
  @ApiProperty({
    description: 'Datos de la asignación actualizada',
    type: WorkerAssignmentResponseDto,
  })
  declare data: WorkerAssignmentResponseDto;
}
