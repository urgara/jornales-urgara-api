import {
  IsString,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CreateProduct } from 'src/types/product';

export class CreateProductDto implements CreateProduct {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Trigo',
    maxLength: 40,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  name: string;

  @ApiProperty({
    description: 'Indica si el producto está activo',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
