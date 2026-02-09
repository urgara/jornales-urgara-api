import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkShiftBaseValueSingleResponse } from 'src/types/work-shift-base-value';
import { WorkShiftBaseValueResponseDto } from './work-shift-base-value-response.dto';

export class WorkShiftBaseValueSingleResponseDto
  extends GenericDataResponseDto<WorkShiftBaseValueResponseDto>
  implements WorkShiftBaseValueSingleResponse
{
  @ApiProperty({
    description: 'Datos del valor base con sus valores calculados',
    type: WorkShiftBaseValueResponseDto,
  })
  @ValidateNested()
  @Type(() => WorkShiftBaseValueResponseDto)
  declare data: WorkShiftBaseValueResponseDto;
}
