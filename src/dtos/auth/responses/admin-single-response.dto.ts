import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AdminSingleResponse } from 'src/types/auth';
import { AdminResponseDto } from './admin-response.dto';
import { ValidateNested } from 'class-validator';

export class AdminSingleResponseDto
  extends GenericDataResponseDto<AdminResponseDto>
  implements AdminSingleResponse
{
  @ApiProperty({
    description: 'Datos del administrador',
    type: AdminResponseDto,
  })
  @ValidateNested()
  @Type(() => AdminResponseDto)
  declare data: AdminResponseDto;
}
