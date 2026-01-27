import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { WorkShiftCreatedResponse } from 'src/types/work-shift';
import { SimpleWorkShiftResponseDto } from './simple-work-shift-response.dto';

export class WorkShiftCreatedResponseDto
  extends GenericDataResponseDto<SimpleWorkShiftResponseDto>
  implements WorkShiftCreatedResponse
{
  @ApiProperty({
    description: 'Datos del turno de trabajo creado',
    type: SimpleWorkShiftResponseDto,
  })
  @ValidateNested()
  @Type(() => SimpleWorkShiftResponseDto)
  declare data: SimpleWorkShiftResponseDto;
}
