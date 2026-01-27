import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  IsNumber,
  IsObject,
  IsBoolean,
  isNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  CreateValuesWorkShiftsData,
  WorkShiftCategoryValue,
} from 'src/types/work-shift';
import { DecimalService } from 'src/services/common';
import type { DecimalNumber } from 'src/types/common';
import { BadRequestException } from '@nestjs/common';

export class WorkShiftCategoryValueDto implements WorkShiftCategoryValue {
  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: 'Valor remunerado',
    example: 15000.5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  remunerated: number;

  @ApiProperty({
    description: 'Valor no remunerado',
    example: 5000.25,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  notRemunerated: number;
}

export class WorkShiftValuesDto {
  @ApiProperty({
    description: 'Valores para la categoría STANDART',
    type: [WorkShiftCategoryValueDto],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkShiftCategoryValueDto)
  STANDART: WorkShiftCategoryValueDto[];
}

export class WorkShiftListItemDto {
  @ApiProperty({
    description: 'ID del turno de trabajo',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Descripción del turno de trabajo (opcional)',
    example: '07 A 13 (LUN A SAB)',
    maxLength: 60,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  description?: string;

  @ApiProperty({
    description: 'Coeficiente del turno',
    example: '1.5',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => (value: string) => DecimalService.create(value))
  coefficient: DecimalNumber;

  @ApiProperty({
    description: 'Array de IDs de categorías asociadas al turno',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}

export class CreateValuesWorkShiftsDto implements CreateValuesWorkShiftsData {
  @ApiProperty({
    description: 'Fecha inicial de creación de los turnos',
    example: '2024-01-15T08:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  initialDate: Date;

  @ApiProperty({
    description: 'ID del puerto donde se crean los turnos',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  portId: number;

  @ApiProperty({
    description: 'Indica si se incluyen valores para la categoría JC',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  jc: boolean;

  @ApiProperty({
    description: 'Valores base para las categorías STANDART',
    type: WorkShiftValuesDto,
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => WorkShiftValuesDto)
  values: {
    STANDART: WorkShiftCategoryValueDto[];
  };

  @ApiProperty({
    description: 'Lista de turnos a crear con sus coeficientes',
    type: [WorkShiftListItemDto],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkShiftListItemDto)
  list: Array<{
    id: string;
    description?: string;
    coefficient: DecimalNumber;
    categoryIds?: number[];
  }>;
}
