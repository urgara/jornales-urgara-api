import { IsOptional, IsInt, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { FindWorkersQuery, WorkerSortBy } from 'src/types/worker';
import { PaginationRequestDto } from 'src/dtos/common';

const workerSortBy: WorkerSortBy[] = [
  'id',
  'name',
  'surname',
  'dni',
  'companyId',
  'localityId',
  'createdAt',
];

export class WorkersQueryDto
  extends PaginationRequestDto
  implements FindWorkersQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: workerSortBy,
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(workerSortBy)
  sortBy?: WorkerSortBy = 'name';

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
    description: 'Filtrar por nombre del trabajador',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por apellido del trabajador',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por DNI',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de empresa',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  companyId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de localidad',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  localityId?: number;
}
