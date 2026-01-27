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
import type { CreateCompany } from 'src/types/company';

export class CreateCompanyDto implements CreateCompany {
  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Acme Corporation',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  name: string;

  @ApiProperty({
    description: 'CUIT de la empresa',
    example: '20123456789',
    maxLength: 11,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  cuit?: string;

  @ApiProperty({
    description: 'ID de la entidad legal (razón social)',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  legalEntityId: number;
}
