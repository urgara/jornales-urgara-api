import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { TerminalSingleResponse } from 'src/types/terminal';
import { TerminalResponseDto } from './terminal-response.dto';

export class TerminalSingleResponseDto
  extends GenericDataResponseDto<TerminalResponseDto>
  implements TerminalSingleResponse
{
  @ApiProperty({
    description: 'Datos de la terminal',
    type: TerminalResponseDto,
  })
  declare data: TerminalResponseDto;
}
