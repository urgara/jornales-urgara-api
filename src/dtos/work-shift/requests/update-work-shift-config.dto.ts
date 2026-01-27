import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { CreateOrUpdateWorkShiftConfig } from 'src/types/work-shift';

export class WorkShiftItemDto {
  @ApiProperty({ description: 'Work shift ID (UUID)', required: true })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Work shift description (optional, used for shifts without specific days)',
    example: 'Encargado Vapor',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Work shift coefficient',
    example: '1.50',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsDecimal()
  coefficient: string;

  @ApiProperty({
    description: 'Array of category IDs associated with this work shift',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}

class WorkShiftTypesDto {
  @ApiProperty({
    description: 'Standard category IDs',
    type: [Number],
    example: [1, 2],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  STANDART: number[];
}

class WorkShiftConfigDataDto {
  @ApiProperty({ description: 'JC flag', example: true })
  @IsNotEmpty()
  @IsBoolean()
  jc: boolean;

  @ApiProperty({
    description: 'Category types',
    type: WorkShiftTypesDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkShiftTypesDto)
  types: WorkShiftTypesDto;

  @ApiProperty({ description: 'Locality ID (donde está el puerto)', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  localityId: number;

  @ApiProperty({
    description: 'List of work shifts',
    type: [WorkShiftItemDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkShiftItemDto)
  list: WorkShiftItemDto[];
}

export class CreateOrUpdateWorkShiftConfigDto
  implements CreateOrUpdateWorkShiftConfig
{
  @ApiProperty({ description: 'Locality ID (donde está el puerto)', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'Work shift configuration data',
    type: WorkShiftConfigDataDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkShiftConfigDataDto)
  config: WorkShiftConfigDataDto;
}
