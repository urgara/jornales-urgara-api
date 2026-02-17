import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { FindShipsQuery, ShipSortBy } from 'src/types/ship';
import { PaginationRequestDto } from 'src/dtos/common';

const shipSortBy: ShipSortBy[] = ['id', 'name', 'createdAt'];

export class ShipsQueryDto
  extends PaginationRequestDto
  implements FindShipsQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: shipSortBy,
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(shipSortBy)
  sortBy?: ShipSortBy = 'name';

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
    description: 'Filtrar por nombre del barco',
    example: 'Atlantic',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
