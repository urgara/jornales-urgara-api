import {
  IsOptional,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { FindProductsQuery, ProductSortBy } from 'src/types/product';
import { PaginationRequestDto } from 'src/dtos/common';

const productSortBy: ProductSortBy[] = ['id', 'name'];

export class ProductsQueryDto
  extends PaginationRequestDto
  implements FindProductsQuery
{
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'name',
    enum: productSortBy,
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(productSortBy)
  sortBy?: ProductSortBy = 'name';

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
    description: 'Filtrar por nombre del producto',
    example: 'Trigo',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo/inactivo',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}
