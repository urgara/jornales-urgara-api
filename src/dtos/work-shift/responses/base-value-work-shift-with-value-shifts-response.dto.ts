import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import type { DecimalNumber } from 'src/types/common';
import type { BaseValueWorkShiftWithValueShifts } from 'src/types/work-shift';
import { CategoryResponseDto } from 'src/dtos/category/responses/category-response.dto';
import { ValueWorkShiftWithWorkShiftResponseDto } from './value-work-shift-with-work-shift-response.dto';

export class BaseValueWorkShiftWithValueShiftsResponseDto
  implements BaseValueWorkShiftWithValueShifts
{
  @ApiProperty({
    description: 'ID del valor base del turno',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Port id del valor base del turno',
    example: 1,
  })
  portId: number;

  @ApiProperty({
    description: 'Valor remunerado base',
    example: '15000.50',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value?.toString())
  remuneratedValue: string;

  @ApiProperty({
    description: 'Valor no remunerado base',
    example: '5000.25',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value?.toString())
  notRemuneratedValue: string;

  @ApiProperty({
    description: 'ID de la categoría asociada',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Fecha de inicio de vigencia',
    example: '2024-01-15T08:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de fin de vigencia',
    example: null,
    nullable: true,
  })
  endDate: Date | null;

  @ApiProperty({
    description: 'Categoría asociada',
    type: CategoryResponseDto,
  })
  @ValidateNested()
  @Type(() => CategoryResponseDto)
  Category: CategoryResponseDto;

  @ApiProperty({
    description: 'Lista de valores de turnos asociados con sus turnos',
    type: [ValueWorkShiftWithWorkShiftResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => ValueWorkShiftWithWorkShiftResponseDto)
  ValueWorkShift: ValueWorkShiftWithWorkShiftResponseDto[];
}
