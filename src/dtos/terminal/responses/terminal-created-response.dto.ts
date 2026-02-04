import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { TerminalCreatedResponse } from 'src/types/terminal';
import { TerminalResponseDto } from './terminal-response.dto';

export class TerminalCreatedResponseDto
  extends GenericDataResponseDto<TerminalResponseDto>
  implements TerminalCreatedResponse
{
  @ApiProperty({
    description: 'Datos de la terminal creada',
    type: TerminalResponseDto,
  })
  declare data: TerminalResponseDto;
}
