import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CreateTerminal } from 'src/types/terminal';
import type { LocalityOperationContext } from 'src/types/locality';

export class CreateTerminalDto
  implements CreateTerminal, LocalityOperationContext
{
  @ApiProperty({
    description: 'Nombre de la terminal',
    example: 'Terminal Central',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @ApiProperty({
    description: 'ID de la localidad (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  localityId: string;
}
