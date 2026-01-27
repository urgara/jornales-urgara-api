import { GenericResponseDto } from 'src/dtos/common';
import type { LocalityDeletedResponse } from 'src/types/locality';

export class LocalityDeletedResponseDto
  extends GenericResponseDto
  implements LocalityDeletedResponse {}
