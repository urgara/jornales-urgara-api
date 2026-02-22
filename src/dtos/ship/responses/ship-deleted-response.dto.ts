import { GenericResponseDto } from 'src/dtos/common';
import type { ShipDeletedResponse } from 'src/types/ship';

export class ShipDeletedResponseDto
  extends GenericResponseDto
  implements ShipDeletedResponse {}
