import { GenericResponseDto } from 'src/dtos/common';
import type { WorkShiftBaseValueDeletedResponse } from 'src/types/work-shift-base-value';

export class WorkShiftBaseValueDeletedResponseDto
  extends GenericResponseDto
  implements WorkShiftBaseValueDeletedResponse {}
