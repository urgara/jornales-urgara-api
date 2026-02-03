import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AgencyCreatedResponse } from 'src/types/agency';
import { AgencyResponseDto } from './agency-response.dto';

export class AgencyCreatedResponseDto
  extends GenericDataResponseDto<AgencyResponseDto>
  implements AgencyCreatedResponse
{
  @ApiProperty({
    description: 'Datos de la agencia creada',
    type: AgencyResponseDto,
  })
  declare data: AgencyResponseDto;
}
