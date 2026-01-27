import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { LocalityUpdatedResponse } from 'src/types/locality';
import { LocalityResponseDto } from './locality-response.dto';
import { ValidateNested } from 'class-validator';

export class LocalityUpdatedResponseDto
  extends GenericDataResponseDto<LocalityResponseDto>
  implements LocalityUpdatedResponse
{
  @ApiProperty({
    description: 'Datos de la localidad actualizada',
    type: LocalityResponseDto,
  })
  @ValidateNested()
  @Type(() => LocalityResponseDto)
  declare data: LocalityResponseDto;
}
