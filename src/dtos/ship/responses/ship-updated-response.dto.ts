import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ShipUpdatedResponse } from 'src/types/ship';
import { ShipResponseDto } from './ship-response.dto';

export class ShipUpdatedResponseDto
  extends GenericDataResponseDto<ShipResponseDto>
  implements ShipUpdatedResponse
{
  @ApiProperty({
    description: 'Datos del barco actualizado',
    type: ShipResponseDto,
  })
  declare data: ShipResponseDto;
}
