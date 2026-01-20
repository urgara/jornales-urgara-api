import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AdminCreatedResponse } from 'src/types/auth';
import { AdminResponseDto } from './admin-response.dto';
import { ValidateNested } from 'class-validator';

export class AdminCreatedResponseDto
  extends GenericDataResponseDto<AdminResponseDto>
  implements AdminCreatedResponse
{
  @ApiProperty({
    type: AdminResponseDto,
    description: 'Datos del administrador creado',
  })
  @ValidateNested()
  @Type(() => AdminResponseDto)
  declare data: AdminResponseDto;
}
