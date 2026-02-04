import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CreateTerminal } from 'src/types/terminal';

export class CreateTerminalDto implements CreateTerminal {
  @ApiProperty({
    description: 'Nombre de la terminal',
    example: 'Terminal Central',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;
}
