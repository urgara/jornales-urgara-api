import {
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  FindWorkShiftBaseValueSelectQuery,
  Category,
} from 'src/types/work-shift-base-value';

export class WorkShiftBaseValueSelectQueryDto
  implements FindWorkShiftBaseValueSelectQuery
{
  @ApiProperty({
    description:
      'Fecha para buscar valores base vigentes (startDate <= date <= endDate)',
    example: '2026-06-15T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Categoría del trabajador',
    example: 'IDONEO',
    enum: ['IDONEO', 'PERITO'],
  })
  @IsNotEmpty()
  @IsEnum(['IDONEO', 'PERITO'])
  category: Category;

  @ApiPropertyOptional({
    description: 'ID de localidad (requerido para ADMIN, ignorado para LOCAL)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  localityId?: string;
}
