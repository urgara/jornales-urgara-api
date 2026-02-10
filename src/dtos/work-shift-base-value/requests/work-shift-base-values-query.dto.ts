import { IsOptional, IsString, IsIn, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type {
  FindWorkShiftBaseValueQuery,
  WorkShiftBaseValueSortBy,
  Category,
} from 'src/types/work-shift-base-value';
import { PaginationRequestDto } from 'src/dtos/common';

const workShiftBaseValueSortBy: WorkShiftBaseValueSortBy[] = [
  'id',
  'startDate',
  'endDate',
];

export class WorkShiftBaseValuesQueryDto
  extends PaginationRequestDto
  implements FindWorkShiftBaseValueQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'startDate',
    enum: workShiftBaseValueSortBy,
  })
  @IsOptional()
  @IsIn(workShiftBaseValueSortBy)
  sortBy?: WorkShiftBaseValueSortBy;

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'ID de localidad (requerido para ADMIN, ignorado para LOCAL)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  localityId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por categoría',
    example: 'IDONEO',
    enum: ['IDONEO', 'PERITO'],
  })
  @IsOptional()
  @IsEnum(['IDONEO', 'PERITO'])
  category?: Category;
}
