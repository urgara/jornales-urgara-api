import { GenericResponseDto } from 'src/dtos/common';
import type { LogoutResponse } from 'src/types/auth';

export class LogoutResponseDto
  extends GenericResponseDto
  implements LogoutResponse {}
