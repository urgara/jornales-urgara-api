import { Module } from '@nestjs/common';
import { WorkerAssignmentController } from '../controllers/worker-assignment.controller';
import {
  WorkerAssignmentCalculationService,
  WorkerAssignmentCreateService,
  WorkerAssignmentReadService,
  WorkerAssignmentUpdateService,
} from '../services/worker-assignment';

@Module({
  controllers: [WorkerAssignmentController],
  providers: [
    WorkerAssignmentCalculationService,
    WorkerAssignmentCreateService,
    WorkerAssignmentReadService,
    WorkerAssignmentUpdateService,
  ],
})
export class WorkerAssignmentModule {}
