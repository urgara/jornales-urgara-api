import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import type { DecimalNumber } from 'src/types/common';
import type {
  SimpleWorkShiftBaseValueResponse,
  SimpleWorkShiftCalculatedValueResponse,
  Category,
} from 'src/types/work-shift-base-value';

export class WorkShiftCalculatedValueResponseDto
  implements SimpleWorkShiftCalculatedValueResponse
{
  @ApiProperty({
    description: 'ID del valor base asociado',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  workShiftBaseValueId: string;

  @ApiProperty({
    description: 'Coeficiente',
    example: '1.50',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  coefficient: string;

  @ApiProperty({
    description: 'Valor remunerativo calculado (base * coeficiente)',
    example: '2250.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  remunerated: string;

  @ApiProperty({
    description: 'Valor no remunerativo calculado (base * coeficiente)',
    example: '750.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  notRemunerated: string;
}

export class WorkShiftBaseValueResponseDto
  implements SimpleWorkShiftBaseValueResponse
{
  @ApiProperty({
    description: 'ID del valor base',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  id: string;

  @ApiProperty({
    description: 'Valor remunerativo',
    example: '1500.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  remunerated: string;

  @ApiProperty({
    description: 'Valor no remunerativo',
    example: '500.00',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber | undefined }) =>
    value ? value.toString() : undefined,
  )
  notRemunerated: string;

  @ApiProperty({
    description: 'Fecha de inicio de vigencia',
    example: '2026-01-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de fin de vigencia',
    example: '2026-12-31T23:59:59.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Categoría del trabajador',
    example: 'IDONEO',
    enum: ['IDONEO', 'PERITO'],
  })
  category: Category;

  @ApiProperty({
    description: 'Valores calculados asociados',
    type: [WorkShiftCalculatedValueResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => WorkShiftCalculatedValueResponseDto)
  workShiftCalculatedValues: WorkShiftCalculatedValueResponseDto[];
}
