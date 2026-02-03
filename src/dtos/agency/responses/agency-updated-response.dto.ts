import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AgencyUpdatedResponse } from 'src/types/agency';
import { AgencyResponseDto } from './agency-response.dto';

export class AgencyUpdatedResponseDto
  extends GenericDataResponseDto<AgencyResponseDto>
  implements AgencyUpdatedResponse
{
  @ApiProperty({
    description: 'Datos de la agencia actualizada',
    type: AgencyResponseDto,
  })
  declare data: AgencyResponseDto;
}
