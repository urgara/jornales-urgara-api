import { PartialType } from '@nestjs/swagger';
import { CreateWorkShiftDto } from './create-work-shift.dto';
import type { UpdateWorkShift } from 'src/types/work-shift';

export class UpdateWorkShiftDto
  extends PartialType(CreateWorkShiftDto)
  implements UpdateWorkShift {}
