import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common/generic-data-response.dto';
import { PaginationDataResponseDto } from 'src/dtos/common';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseValueWorkShiftWithValueShiftsResponseDto } from './base-value-work-shift-with-value-shifts-response.dto';
import { AllBaseValueWorkShiftsResponse } from 'src/types/work-shift';

export class AllBaseValueWorkShiftsResponseDto
  extends IntersectionType(
    GenericDataResponseDto<BaseValueWorkShiftWithValueShiftsResponseDto[]>,
    PaginationDataResponseDto,
  )
  implements AllBaseValueWorkShiftsResponse
{
  @ApiProperty({
    description:
      'Lista de valores base de turnos con sus valores de turno y turnos asociados',
    type: [BaseValueWorkShiftWithValueShiftsResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => BaseValueWorkShiftWithValueShiftsResponseDto)
  declare data: BaseValueWorkShiftWithValueShiftsResponseDto[];
}
