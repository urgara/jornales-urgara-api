import {
  IsString,
  IsNotEmpty,
  Length,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { CreateWorker } from 'src/types/worker';
import type { LocalityOperationContext } from 'src/types/locality';
import { Category } from 'src/types/worker';
import { DecimalService } from 'src/services/common';
import type { DecimalNumber } from 'src/types/common';
import { IsDecimalNumber } from 'src/decorators/common';

export class CreateWorkerDto implements CreateWorker, LocalityOperationContext {
  @ApiProperty({
    description: 'Nombre del trabajador',
    example: 'Juan',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Apellido del trabajador',
    example: 'Pérez',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  surname: string;

  @ApiProperty({
    description: 'DNI del trabajador',
    example: '12345678',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Length(7, 10)
  dni: string;

  @ApiProperty({
    description: 'Categoría del trabajador',
    example: 'IDONEO',
    enum: Category,
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: 'Tarifa base por hora del trabajador',
    example: '1500.00',
    type: 'string',
  })
  @Transform(({ value }) => value !== undefined ? DecimalService.create(value) : undefined)
  @IsDecimalNumber()
  baseHourlyRate: DecimalNumber;

  @ApiProperty({
    description: 'ID de la localidad (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  localityId: string;
}
