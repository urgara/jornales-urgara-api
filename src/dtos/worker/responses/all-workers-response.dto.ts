import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllWorkersResponse } from 'src/types/worker';
import { WorkerResponseDto } from './worker-response.dto';

export class AllWorkersResponseDto
  extends GenericDataResponseDto<WorkerResponseDto[]>
  implements AllWorkersResponse
{
  @ApiProperty({
    description: 'Lista de trabajadores',
    type: [WorkerResponseDto],
  })
  @Type(() => WorkerResponseDto)
  declare data: WorkerResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
