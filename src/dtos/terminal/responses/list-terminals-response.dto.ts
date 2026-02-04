import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListTerminalsResponse } from 'src/types/terminal';
import { TerminalSelectItemDto } from './terminal-select-response.dto';

export class ListTerminalsResponseDto
  extends GenericDataResponseDto<TerminalSelectItemDto[]>
  implements ListTerminalsResponse
{
  @ApiProperty({
    description: 'Lista de terminales para select',
    type: [TerminalSelectItemDto],
  })
  declare data: TerminalSelectItemDto[];
}
