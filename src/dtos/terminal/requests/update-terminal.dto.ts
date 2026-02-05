import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateTerminalDto } from './create-terminal.dto';
import type { UpdateTerminal } from 'src/types/terminal';

export class UpdateTerminalDto
  extends PartialType(CreateTerminalDto)
  implements UpdateTerminal
{
  @ApiProperty({
    description: 'ID de la localidad (UUID) - para identificar la DB',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  localityId?: string;
}
