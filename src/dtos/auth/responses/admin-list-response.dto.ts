import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  GenericDataResponseDto,
  PaginationDataResponseDto,
} from 'src/dtos/common';
import type { AdminListResponse } from 'src/types/auth';
import { AdminResponseDto } from './admin-response.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class AdminListResponseDto
  extends IntersectionType(
    GenericDataResponseDto<AdminResponseDto[]>,
    PaginationDataResponseDto,
  )
  implements AdminListResponse
{
  @ApiProperty({
    type: [AdminResponseDto],
    description: 'Lista de administradores',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminResponseDto)
  declare data: AdminResponseDto[];
}
