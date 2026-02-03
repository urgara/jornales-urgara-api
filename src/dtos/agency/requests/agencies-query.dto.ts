import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { FindAgenciesQuery, AgencySortBy } from 'src/types/agency';
import { PaginationRequestDto } from 'src/dtos/common';

const agencySortBy: AgencySortBy[] = ['id', 'name', 'createdAt'];

export class AgenciesQueryDto
  extends PaginationRequestDto
  implements FindAgenciesQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: agencySortBy,
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(agencySortBy)
  sortBy?: AgencySortBy = 'name';

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'asc',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de la agencia',
    example: 'Agencia Nacional',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
