import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common/generic-data-response.dto';
import { PaginationDataResponseDto } from 'src/dtos/common';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkShiftBaseValueResponseDto } from './work-shift-base-value-response.dto';
import type { AllWorkShiftBaseValuesResponse } from 'src/types/work-shift-base-value';

export class AllWorkShiftBaseValuesResponseDto
  extends IntersectionType(
    GenericDataResponseDto<WorkShiftBaseValueResponseDto[]>,
    PaginationDataResponseDto,
  )
  implements AllWorkShiftBaseValuesResponse
{
  @ApiProperty({
    description: 'Lista de valores base con sus valores calculados',
    type: [WorkShiftBaseValueResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => WorkShiftBaseValueResponseDto)
  declare data: WorkShiftBaseValueResponseDto[];
}
