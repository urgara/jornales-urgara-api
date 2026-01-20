import { PickType } from '@nestjs/swagger';
import type { LoginAdmin } from 'src/types/auth';
import { CreateAdminDto } from './create-admin.dto';

export class LoginDto
  extends PickType(CreateAdminDto, ['dni', 'password'])
  implements LoginAdmin {}
