import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkerSingleResponse } from 'src/types/worker';
import { WorkerResponseDto } from './worker-response.dto';

export class WorkerSingleResponseDto
  extends GenericDataResponseDto<WorkerResponseDto>
  implements WorkerSingleResponse
{
  @ApiProperty({
    description: 'Datos del trabajador',
    type: WorkerResponseDto,
  })
  declare data: WorkerResponseDto;
}
