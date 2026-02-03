import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListAgenciesResponse } from 'src/types/agency';

class AgencySelectDto {
  @ApiProperty({
    description: 'ID de la agencia (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la agencia',
    example: 'Agencia Nacional de Cargas',
  })
  name: string;
}

export class ListAgenciesResponseDto
  extends GenericDataResponseDto<AgencySelectDto[]>
  implements ListAgenciesResponse
{
  @ApiProperty({
    description: 'Lista simplificada de agencias para selección',
    type: [AgencySelectDto],
  })
  declare data: AgencySelectDto[];
}
