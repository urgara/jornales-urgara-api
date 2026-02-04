import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { TerminalUpdatedResponse } from 'src/types/terminal';
import { TerminalResponseDto } from './terminal-response.dto';

export class TerminalUpdatedResponseDto
  extends GenericDataResponseDto<TerminalResponseDto>
  implements TerminalUpdatedResponse
{
  @ApiProperty({
    description: 'Datos de la terminal actualizada',
    type: TerminalResponseDto,
  })
  declare data: TerminalResponseDto;
}
