import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CreateShip } from 'src/types/ship';

export class CreateShipDto implements CreateShip {
  @ApiProperty({
    description: 'Nombre del barco',
    example: 'SS Atlantic',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  name: string;
}
