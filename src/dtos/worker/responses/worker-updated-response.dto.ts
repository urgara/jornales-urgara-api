import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkerUpdatedResponse } from 'src/types/worker';
import { WorkerResponseDto } from './worker-response.dto';

export class WorkerUpdatedResponseDto
  extends GenericDataResponseDto<WorkerResponseDto>
  implements WorkerUpdatedResponse
{
  @ApiProperty({
    description: 'Datos del trabajador actualizado',
    type: WorkerResponseDto,
  })
  declare data: WorkerResponseDto;
}
