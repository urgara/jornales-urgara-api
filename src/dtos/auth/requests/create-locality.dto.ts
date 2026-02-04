import {
  IsNotEmpty,
  Length,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateLocality } from 'src/types/locality';

export class CreateLocalityDto implements CreateLocality {
  @ApiProperty({
    description: 'Nombre de la localidad',
    example: 'Buenos Aires',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Nombre de la provincia',
    example: 'Buenos Aires',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  province: string;

  @ApiPropertyOptional({
    description: 'Habilita el calculo JC si lo utiliza esa localidad',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCalculateJc: boolean;
}
