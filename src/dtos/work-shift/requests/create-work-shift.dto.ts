import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsArray,
  IsEnum,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import type { CreateWorkShift } from 'src/types/work-shift';
import type { LocalityOperationContext } from 'src/types/locality';
import { DayOfWeek } from 'src/types/work-shift';
import type { DecimalNumber } from 'src/types/common';
import { DecimalService } from 'src/services/common';
import { IsDecimalNumber } from 'src/decorators/common';

export class CreateWorkShiftDto implements CreateWorkShift, LocalityOperationContext {
  @ApiProperty({
    description:
      'Días aplicables al turno. Si está vacío, debe proporcionar description',
    example: ['M', 'T', 'W', 'Th', 'F', 'S'],
    enum: DayOfWeek,
    isArray: true,
  })
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  days: DayOfWeek[];

  @ApiProperty({
    description:
      'Hora de inicio del turno (formato HH:mm). Obligatorio si days tiene elementos',
    example: '08:00',
    required: false,
  })
  @ValidateIf((o) => o.days && o.days.length > 0)
  @IsNotEmpty({ message: 'startTime is required when days is not empty' })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime?: string;

  @ApiProperty({
    description:
      'Hora de fin del turno (formato HH:mm). Obligatorio si days tiene elementos',
    example: '14:00',
    required: false,
  })
  @ValidateIf((o) => o.days && o.days.length > 0)
  @IsNotEmpty({ message: 'endTime is required when days is not empty' })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime?: string;

  @ApiProperty({
    description:
      'Descripción manual del turno. Obligatoria si days está vacío (ej: "Encargado de carga")',
    example: 'Encargado de carga',
    maxLength: 60,
    required: false,
  })
  @ValidateIf((o) => !o.days || o.days.length === 0)
  @IsNotEmpty({ message: 'description is required when days is empty' })
  @IsString()
  @MaxLength(60)
  description?: string;

  @ApiProperty({
    description: 'Coeficiente del turno',
    example: '1.50',
    type: 'string',
  })
  @Transform(({ value }) => value !== undefined ? DecimalService.create(value) : undefined)
  @IsNotEmpty()
  @IsDecimalNumber()
  coefficient: DecimalNumber;

  @ApiProperty({
    description: 'ID de la localidad (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  localityId: string;
}
