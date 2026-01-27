import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkShifts } from 'src/types/work-shift';
import { WorkShiftResponseDto } from './work-shift-response.dto';

export class ListWorkShiftsResponseDto extends GenericDataResponseDto<WorkShifts> {
  @ApiProperty({
    description: 'Work shifts data',
    type: [WorkShiftResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkShiftResponseDto)
  declare data: WorkShifts;
}
