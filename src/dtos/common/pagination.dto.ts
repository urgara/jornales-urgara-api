import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import {
  PaginationDataResponse,
  PaginationRequest,
  PaginationResponse,
} from 'src/types/common';

export class PaginationRequestDto implements PaginationRequest {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginationResponseDto implements PaginationResponse {
  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  limit: number;

  @ApiProperty({
    example: 50,
    description: 'Total number of items',
  })
  total: number;

  @ApiProperty({
    example: 5,
    description: 'Total number of pages',
  })
  totalPages: number;
}
export class PaginationDataResponseDto implements PaginationDataResponse {
  @ApiProperty({
    type: PaginationResponseDto,
  })
  @ValidateNested()
  @Type(() => PaginationResponseDto)
  pagination: PaginationResponseDto;
}
