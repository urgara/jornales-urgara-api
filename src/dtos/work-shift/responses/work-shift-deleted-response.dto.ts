import { GenericResponseDto } from 'src/dtos/common';
import type { WorkShiftDeletedResponse } from 'src/types/work-shift';

export class WorkShiftDeletedResponseDto
  extends GenericResponseDto
  implements WorkShiftDeletedResponse {}
