import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { CreateWorker } from 'src/types/worker';

export class CreateWorkerDto implements CreateWorker {
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
    description: 'ID de la empresa (opcional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  companyId?: number;

  @ApiProperty({
    description: 'ID de la localidad',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  localityId: number;
}
