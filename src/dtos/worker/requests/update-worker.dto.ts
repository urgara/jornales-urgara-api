import { PartialType } from '@nestjs/swagger';
import { CreateWorkerDto } from './create-worker.dto';
import type { UpdateWorker } from 'src/types/worker';

export class UpdateWorkerDto
  extends PartialType(CreateWorkerDto)
  implements UpdateWorker {}
