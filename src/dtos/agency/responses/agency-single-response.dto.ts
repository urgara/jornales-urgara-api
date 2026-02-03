import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AgencySingleResponse } from 'src/types/agency';
import { AgencyResponseDto } from './agency-response.dto';

export class AgencySingleResponseDto
  extends GenericDataResponseDto<AgencyResponseDto>
  implements AgencySingleResponse
{
  @ApiProperty({
    description: 'Datos de la agencia',
    type: AgencyResponseDto,
  })
  declare data: AgencyResponseDto;
}
