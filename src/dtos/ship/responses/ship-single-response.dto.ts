import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ShipSingleResponse } from 'src/types/ship';
import { ShipResponseDto } from './ship-response.dto';

export class ShipSingleResponseDto
  extends GenericDataResponseDto<ShipResponseDto>
  implements ShipSingleResponse
{
  @ApiProperty({
    description: 'Datos del barco',
    type: ShipResponseDto,
  })
  declare data: ShipResponseDto;
}
