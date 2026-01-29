import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListWorkersResponse } from 'src/types/worker';
import { WorkerSelectItemDto } from './worker-select-response.dto';

export class ListWorkersResponseDto
  extends GenericDataResponseDto<WorkerSelectItemDto[]>
  implements ListWorkersResponse
{
  @ApiProperty({
    description: 'Lista de trabajadores para select',
    type: [WorkerSelectItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkerSelectItemDto)
  declare data: WorkerSelectItemDto[];
}
