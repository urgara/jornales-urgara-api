import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CreateAgency } from 'src/types/agency';

export class CreateAgencyDto implements CreateAgency {
  @ApiProperty({
    description: 'Nombre de la agencia',
    example: 'Agencia Nacional de Cargas',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  name: string;
}
