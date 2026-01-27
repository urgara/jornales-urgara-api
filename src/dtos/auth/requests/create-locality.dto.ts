import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
}
