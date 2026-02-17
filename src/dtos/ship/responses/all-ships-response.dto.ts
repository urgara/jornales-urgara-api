import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllShipsResponse } from 'src/types/ship';
import { ShipResponseDto } from './ship-response.dto';

export class AllShipsResponseDto
  extends GenericDataResponseDto<ShipResponseDto[]>
  implements AllShipsResponse
{
  @ApiProperty({
    description: 'Lista de barcos',
    type: [ShipResponseDto],
  })
  declare data: ShipResponseDto[];

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
