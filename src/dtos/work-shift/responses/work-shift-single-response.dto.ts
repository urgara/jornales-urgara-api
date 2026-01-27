import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkShiftSingleResponse } from 'src/types/work-shift';
import { SimpleWorkShiftResponseDto } from './simple-work-shift-response.dto';

export class WorkShiftSingleResponseDto
  extends GenericDataResponseDto<SimpleWorkShiftResponseDto>
  implements WorkShiftSingleResponse
{
  @ApiProperty({
    description: 'Datos del turno de trabajo',
    type: SimpleWorkShiftResponseDto,
  })
  @ValidateNested()
  @Type(() => SimpleWorkShiftResponseDto)
  declare data: SimpleWorkShiftResponseDto;
}
