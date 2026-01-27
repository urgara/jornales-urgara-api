import { ApiProperty } from '@nestjs/swagger';
import { WorkShiftResponseDto } from './work-shift-response.dto';
import { BaseValueWorkShiftResponseDto } from './base-value-work-shift-response.dto';

export class WorkShiftWithBaseValueResponseDto extends WorkShiftResponseDto {
  @ApiProperty({
    description: 'Valor base del turno asociado',
    type: BaseValueWorkShiftResponseDto,
  })
  BaseValueWorkShift: BaseValueWorkShiftResponseDto;
}
