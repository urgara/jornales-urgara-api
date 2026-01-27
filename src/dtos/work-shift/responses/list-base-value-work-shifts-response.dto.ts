import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ValueWorkShiftsWithBaseValue } from 'src/types/work-shift';
import { ValueWorkShiftWithBaseValueResponseDto } from './value-work-shift-with-base-value-response.dto';

export class ListBaseValueWorkShiftsResponseDto extends GenericDataResponseDto<ValueWorkShiftsWithBaseValue> {
  @ApiProperty({
    description: 'Value work shifts with their base values',
    type: [ValueWorkShiftWithBaseValueResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueWorkShiftWithBaseValueResponseDto)
  declare data: ValueWorkShiftsWithBaseValue;
}
