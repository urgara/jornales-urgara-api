import { PartialType } from '@nestjs/swagger';

import type { UpdateAdmin } from 'src/types/auth';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto
  extends PartialType(CreateAdminDto)
  implements UpdateAdmin {}
