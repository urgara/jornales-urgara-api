import { GenericResponseDto } from 'src/dtos/common';
import type { WorkerDeletedResponse } from 'src/types/worker';

export class WorkerDeletedResponseDto
  extends GenericResponseDto
  implements WorkerDeletedResponse {}
