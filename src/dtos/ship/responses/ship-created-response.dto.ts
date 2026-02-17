import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ShipCreatedResponse } from 'src/types/ship';
import { ShipResponseDto } from './ship-response.dto';

export class ShipCreatedResponseDto
  extends GenericDataResponseDto<ShipResponseDto>
  implements ShipCreatedResponse
{
  @ApiProperty({
    description: 'Datos del barco creado',
    type: ShipResponseDto,
  })
  declare data: ShipResponseDto;
}
