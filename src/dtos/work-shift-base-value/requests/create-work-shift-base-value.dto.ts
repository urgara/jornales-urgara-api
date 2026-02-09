import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import type { CreateWorkShiftBaseValue } from 'src/types/work-shift-base-value';
import type { LocalityOperationContext } from 'src/types/locality';
import type { DecimalNumber } from 'src/types/common';
import { DecimalService } from 'src/services/common';
import { IsDecimalNumber } from 'src/decorators/common';

export class CreateWorkShiftBaseValueDto
  implements CreateWorkShiftBaseValue, LocalityOperationContext
{
  @ApiProperty({
    description: 'Valor remunerativo base',
    example: '1500.00',
    type: 'string',
  })
  @Transform(({ value }) => DecimalService.create(value))
  @IsNotEmpty()
  @IsDecimalNumber()
  remunerated: DecimalNumber;

  @ApiProperty({
    description: 'Valor no remunerativo base',
    example: '500.00',
    type: 'string',
  })
  @Transform(({ value }) => DecimalService.create(value))
  @IsNotEmpty()
  @IsDecimalNumber()
  notRemunerated: DecimalNumber;

  @ApiProperty({
    description: 'Fecha de inicio de vigencia',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin de vigencia',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description:
      'Array de coeficientes para generar los valores calculados (ej: ["1.50", "2.00"])',
    example: ['1.50', '2.00'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    Array.isArray(value)
      ? value.map((v: string) => DecimalService.create(v))
      : value,
  )
  coefficients: DecimalNumber[];

  @ApiProperty({
    description: 'ID de la localidad (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  localityId: string;
}
