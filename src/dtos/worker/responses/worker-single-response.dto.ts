import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkerSingleResponse } from 'src/types/worker';
import { WorkerWithRelationsResponseDto } from './worker-with-relations-response.dto';

export class WorkerSingleResponseDto
  extends GenericDataResponseDto<WorkerWithRelationsResponseDto>
  implements WorkerSingleResponse
{
  @ApiProperty({
    description: 'Datos del trabajador con sus relaciones',
    type: WorkerWithRelationsResponseDto,
  })
  declare data: WorkerWithRelationsResponseDto;
}
