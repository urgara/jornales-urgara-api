import { IsOptional, IsInt, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { FindCompaniesQuery, CompanySortBy } from 'src/types/company';
import { PaginationRequestDto } from 'src/dtos/common';

const companySortBy: CompanySortBy[] = ['id', 'name', 'createdAt'];

export class CompaniesQueryDto
  extends PaginationRequestDto
  implements FindCompaniesQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: companySortBy,
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(companySortBy)
  sortBy?: CompanySortBy = 'name';

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
    description: 'Filtrar por nombre de la empresa',
    example: 'Acme',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por CUIT',
    example: '20123456789',
  })
  @IsOptional()
  @IsString()
  cuit?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de entidad legal',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  legalEntityId?: number;
}
