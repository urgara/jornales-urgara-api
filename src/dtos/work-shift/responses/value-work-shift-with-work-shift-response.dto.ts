import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import type { DecimalNumber } from 'src/types/common';
import {
  WorkShiftTypeEnum,
  type ValueWorkShiftWithWorkShift,
} from 'src/types/work-shift';
import { SimpleWorkShiftResponseDto } from './simple-work-shift-response.dto';

export class ValueWorkShiftWithWorkShiftResponseDto
  implements ValueWorkShiftWithWorkShift
{
  @ApiProperty({
    description: 'ID del valor de turno',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID del turno de trabajo (null para categorías especiales que aplican a todos los turnos)',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
    nullable: true,
  })
  workShiftId: string | null;

  @ApiProperty({
    description: 'ID del valor base del turno',
    example: 1,
  })
  baseValueWorkShiftId: number;

  @ApiProperty({
    description: 'Tipo de turno de trabajo',
    enum: WorkShiftTypeEnum,
    example: WorkShiftTypeEnum.STANDART,
  })
  type: (typeof WorkShiftTypeEnum)[keyof typeof WorkShiftTypeEnum];

  @ApiProperty({
    description: 'Valor remunerado calculado',
    example: '22500.75',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value?.toString())
  calculatedRemuneratedValue: string;

  @ApiProperty({
    description: 'Valor no remunerado calculado',
    example: '7500.38',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value?.toString())
  calculatedNotRemuneratedValue: string;

  @ApiProperty({
    description: 'Información del turno de trabajo',
    type: SimpleWorkShiftResponseDto,
  })
  @ValidateNested()
  @Type(() => SimpleWorkShiftResponseDto)
  WorkShift: SimpleWorkShiftResponseDto;
}
