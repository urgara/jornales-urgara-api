import { IsOptional, IsString, IsEnum, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { FindTerminalsQuery, TerminalSortBy } from 'src/types/terminal';

export class TerminalsQueryDto implements FindTerminalsQuery {
  @ApiProperty({
    description: 'Número de página',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Cantidad de registros por página',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Campo por el cual ordenar',
    enum: ['id', 'name'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['id', 'name'])
  sortBy?: TerminalSortBy;

  @ApiProperty({
    description: 'Orden ascendente o descendente',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Filtrar por nombre',
    example: 'Central',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'ID de localidad (requerido para ADMIN, ignorado para LOCAL)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  localityId?: string;
}
