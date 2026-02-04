import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllTerminalsResponse } from 'src/types/terminal';
import { TerminalResponseDto } from './terminal-response.dto';

export class AllTerminalsResponseDto
  extends GenericDataResponseDto<TerminalResponseDto[]>
  implements AllTerminalsResponse
{
  @ApiProperty({
    description: 'Lista de terminales',
    type: [TerminalResponseDto],
  })
  declare data: TerminalResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
