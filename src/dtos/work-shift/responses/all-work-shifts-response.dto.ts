import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common/generic-data-response.dto';
import { PaginationDataResponseDto } from 'src/dtos/common';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SimpleWorkShiftResponseDto } from './simple-work-shift-response.dto';
import { AllWorkShiftsResponse } from 'src/types/work-shift';

export class AllWorkShiftsResponseDto
  extends IntersectionType(
    GenericDataResponseDto<SimpleWorkShiftResponseDto[]>,
    PaginationDataResponseDto,
  )
  implements AllWorkShiftsResponse
{
  @ApiProperty({
    description: 'Lista de todos los turnos de trabajo',
    type: [SimpleWorkShiftResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => SimpleWorkShiftResponseDto)
  declare data: SimpleWorkShiftResponseDto[];
}
