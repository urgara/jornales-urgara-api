import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';

export class LocalitiesQueryDto {
  @ApiProperty({
    description: 'Número de página',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: ['id', 'name', 'province', 'createdAt'],
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'province', 'createdAt'])
  sortBy?: string = 'name';

  @ApiProperty({
    description: 'Dirección de ordenamiento',
    example: 'asc',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiProperty({
    description: 'Filtrar por nombre de localidad',
    example: 'Buenos Aires',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filtrar por nombre de provincia',
    example: 'Buenos Aires',
    required: false,
  })
  @IsOptional()
  @IsString()
  province?: string;
}
