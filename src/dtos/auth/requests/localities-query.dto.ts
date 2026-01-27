import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationRequestDto } from 'src/dtos/common';
import type { LocalitySortBy, FindLocalitiesQuery } from 'src/types/locality';

const localitySortBy: LocalitySortBy[] = [
  'id',
  'name',
  'province',
  'createdAt',
];

export class LocalitiesQueryDto
  extends PaginationRequestDto
  implements FindLocalitiesQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: localitySortBy,
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(localitySortBy)
  sortBy?: LocalitySortBy = 'name';

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    example: 'asc',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de localidad',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de provincia',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  province?: string;
}
