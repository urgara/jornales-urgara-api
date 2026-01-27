import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkShiftUpdatedResponse } from 'src/types/work-shift';
import { SimpleWorkShiftResponseDto } from './simple-work-shift-response.dto';

export class WorkShiftUpdatedResponseDto
  extends GenericDataResponseDto<SimpleWorkShiftResponseDto>
  implements WorkShiftUpdatedResponse
{
  @ApiProperty({
    description: 'Datos del turno de trabajo actualizado',
    type: SimpleWorkShiftResponseDto,
  })
  @ValidateNested()
  @Type(() => SimpleWorkShiftResponseDto)
  declare data: SimpleWorkShiftResponseDto;
}
