import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkerCreatedResponse } from 'src/types/worker';
import { WorkerResponseDto } from './worker-response.dto';

export class WorkerCreatedResponseDto
  extends GenericDataResponseDto<WorkerResponseDto>
  implements WorkerCreatedResponse
{
  @ApiProperty({
    description: 'Datos del trabajador creado',
    type: WorkerResponseDto,
  })
  declare data: WorkerResponseDto;
}
