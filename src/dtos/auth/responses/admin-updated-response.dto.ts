import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AdminUpdatedResponse } from 'src/types/auth';
import { AdminResponseDto } from './admin-response.dto';
import { ValidateNested } from 'class-validator';

export class AdminUpdatedResponseDto
  extends GenericDataResponseDto<AdminResponseDto>
  implements AdminUpdatedResponse
{
  @ApiProperty({
    type: AdminResponseDto,
    description: 'Datos del administrador actualizado',
  })
  @ValidateNested()
  @Type(() => AdminResponseDto)
  declare data: AdminResponseDto;
}
