import { IsOptional, IsInt, IsDate, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type {
  FindBaseValueWorkShiftQuery,
  BaseValueWorkShiftSortBy,
} from 'src/types/work-shift';
import { PaginationRequestDto } from 'src/dtos/common';

const baseValueWorkShiftSortBy: BaseValueWorkShiftSortBy[] = [
  'id',
  'portId',
  'categoryId',
  'startDate',
  'endDate',
];

export class BaseValueWorkShiftsQueryDto
  extends PaginationRequestDto
  implements FindBaseValueWorkShiftQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'startDate',
    enum: baseValueWorkShiftSortBy,
  })
  @IsOptional()
  @IsIn(baseValueWorkShiftSortBy)
  sortBy?: BaseValueWorkShiftSortBy;

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Filtrar por ID del puerto',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  portId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de categoría',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de inicio',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de fin',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
