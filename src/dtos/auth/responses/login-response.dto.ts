import { GenericResponseDto } from 'src/dtos/common';
import type { LoginResponse } from 'src/types/auth';

export class LoginResponseDto
  extends GenericResponseDto
  implements LoginResponse {}
