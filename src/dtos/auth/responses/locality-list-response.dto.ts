import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GenericDataResponseDto } from 'src/dtos/common';
import { PaginationResponseDto } from 'src/dtos/common/pagination.dto';
import { LocalityResponseDto } from './locality-response.dto';
import { ValidateNested } from 'class-validator';

export class LocalityListResponseDto extends GenericDataResponseDto<
  LocalityResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de localidades',
    type: [LocalityResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => LocalityResponseDto)
  declare data: LocalityResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationResponseDto,
  })
  @ValidateNested()
  @Type(() => PaginationResponseDto)
  declare pagination: PaginationResponseDto;
}
