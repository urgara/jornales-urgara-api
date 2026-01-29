import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import { WorkerAssignmentResponseDto } from './worker-assignment-response.dto';
import type { WorkerAssignmentCreatedResponse } from 'src/types/worker-assignment';

export class WorkerAssignmentCreatedResponseDto
  extends GenericDataResponseDto<WorkerAssignmentResponseDto>
  implements WorkerAssignmentCreatedResponse
{
  @ApiProperty({
    description: 'Datos de la asignación creada',
    type: WorkerAssignmentResponseDto,
  })
  declare data: WorkerAssignmentResponseDto;
}
