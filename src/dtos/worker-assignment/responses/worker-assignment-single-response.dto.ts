import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import { WorkerAssignmentWithRelationsDto } from './worker-assignment-with-relations-response.dto';
import type { WorkerAssignmentSingleResponse } from 'src/types/worker-assignment';

export class WorkerAssignmentSingleResponseDto
  extends GenericDataResponseDto<WorkerAssignmentWithRelationsDto>
  implements WorkerAssignmentSingleResponse
{
  @ApiProperty({
    description: 'Datos de la asignación con relaciones',
    type: WorkerAssignmentWithRelationsDto,
  })
  declare data: WorkerAssignmentWithRelationsDto;
}
