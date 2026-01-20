import { GenericResponseDto } from 'src/dtos/common';
import type { AdminDeletedResponse } from 'src/types/auth';

export class AdminDeletedResponseDto
  extends GenericResponseDto
  implements AdminDeletedResponse {}
