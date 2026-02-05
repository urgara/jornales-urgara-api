import { IsOptional, IsString, IsDate, IsIn, MaxLength, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type {
  FindWorkShiftQuery,
  WorkShiftSortBy,
} from 'src/types/work-shift';
import { PaginationRequestDto } from 'src/dtos/common';

const workShiftSortBy: WorkShiftSortBy[] = [
  'id',
  'description',
  'createdAt',
];

export class WorkShiftsQueryDto
  extends PaginationRequestDto
  implements FindWorkShiftQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'createdAt',
    enum: workShiftSortBy,
  })
  @IsOptional()
  @IsIn(workShiftSortBy)
  sortBy?: WorkShiftSortBy;

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Filtrar por descripción del turno (búsqueda parcial)',
    example: 'LUNES',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  description?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de eliminación',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deletedAt?: Date;

  @ApiPropertyOptional({
    description: 'ID de localidad (requerido para ADMIN, ignorado para LOCAL)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  localityId?: string;
}
