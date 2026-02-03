import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllAgenciesResponse } from 'src/types/agency';
import { AgencyResponseDto } from './agency-response.dto';

export class AllAgenciesResponseDto
  extends GenericDataResponseDto<AgencyResponseDto[]>
  implements AllAgenciesResponse
{
  @ApiProperty({
    description: 'Lista de agencias',
    type: [AgencyResponseDto],
  })
  declare data: AgencyResponseDto[];

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
