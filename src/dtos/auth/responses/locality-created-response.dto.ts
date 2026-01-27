import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { LocalityCreatedResponse } from 'src/types/locality';
import { LocalityResponseDto } from './locality-response.dto';
import { ValidateNested } from 'class-validator';

export class LocalityCreatedResponseDto
  extends GenericDataResponseDto<LocalityResponseDto>
  implements LocalityCreatedResponse
{
  @ApiProperty({
    description: 'Datos de la localidad creada',
    type: LocalityResponseDto,
  })
  @ValidateNested()
  @Type(() => LocalityResponseDto)
  declare data: LocalityResponseDto;
}
