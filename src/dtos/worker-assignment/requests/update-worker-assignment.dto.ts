import { PartialType } from '@nestjs/swagger';
import { CreateWorkerAssignmentDto } from './create-worker-assignment.dto';
import type { UpdateWorkerAssignment } from 'src/types/worker-assignment';

export class UpdateWorkerAssignmentDto
  extends PartialType(CreateWorkerAssignmentDto)
  implements UpdateWorkerAssignment {}
