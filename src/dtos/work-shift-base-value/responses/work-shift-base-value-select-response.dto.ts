import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkShiftBaseValueSelectResponse } from 'src/types/work-shift-base-value';
import { WorkShiftBaseValueResponseDto } from './work-shift-base-value-response.dto';

export class WorkShiftBaseValueSelectResponseDto
  extends GenericDataResponseDto<WorkShiftBaseValueResponseDto[]>
  implements WorkShiftBaseValueSelectResponse
{
  @ApiProperty({
    description: 'Lista de valores base vigentes con sus valores calculados',
    type: [WorkShiftBaseValueResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => WorkShiftBaseValueResponseDto)
  declare data: WorkShiftBaseValueResponseDto[];
}
