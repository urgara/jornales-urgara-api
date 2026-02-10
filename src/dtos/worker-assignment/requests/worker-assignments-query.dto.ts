import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type {
  FindWorkerAssignmentQuery,
  WorkerAssignmentSortBy,
} from 'src/types/worker-assignment';

export class WorkerAssignmentsQueryDto implements FindWorkerAssignmentQuery {
  @ApiProperty({
    description: 'Página actual',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Cantidad de resultados por página',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Campo por el cual ordenar',
    example: 'date',
    required: false,
    enum: [
      'id',
      'workerId',
      'workShiftId',
      'date',
      'additionalPercent',
      'totalAmount',
      'companyId',
      'agencyId',
      'terminalId',
      'productId',
      'createdAt',
    ],
  })
  @IsOptional()
  @IsString()
  @IsEnum([
    'id',
    'workerId',
    'workShiftId',
    'date',
    'additionalPercent',
    'totalAmount',
    'companyId',
    'agencyId',
    'terminalId',
    'productId',
    'createdAt',
  ])
  sortBy?: WorkerAssignmentSortBy;

  @ApiProperty({
    description: 'Orden de clasificación',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Filtrar por ID del trabajador',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  workerId?: string;

  @ApiProperty({
    description: 'Filtrar por ID del turno',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  workShiftId?: string;

  @ApiProperty({
    description: 'Fecha desde (formato: YYYY-MM-DD)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be in format YYYY-MM-DD',
  })
  dateFrom?: string;

  @ApiProperty({
    description: 'Fecha hasta (formato: YYYY-MM-DD)',
    example: '2024-01-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateTo must be in format YYYY-MM-DD',
  })
  dateTo?: string;

  @ApiProperty({
    description: 'Filtrar por ID de la empresa',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({
    description: 'Filtrar por ID de la agencia',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  agencyId?: string;

  @ApiProperty({
    description: 'Filtrar por ID de la terminal',
    example: '550e8400-e29b-41d4-a716-446655440004',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  terminalId?: string;

  @ApiProperty({
    description: 'Filtrar por ID del producto',
    example: '550e8400-e29b-41d4-a716-446655440005',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'ID de localidad (requerido para ADMIN, ignorado para LOCAL)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  localityId?: string;
}
