import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListShipsResponse } from 'src/types/ship';
import { ShipSelectItemDto } from './ship-select-response.dto';

export class ListShipsResponseDto
  extends GenericDataResponseDto<ShipSelectItemDto[]>
  implements ListShipsResponse
{
  @ApiProperty({
    description: 'Lista de barcos para select',
    type: [ShipSelectItemDto],
  })
  declare data: ShipSelectItemDto[];
}
