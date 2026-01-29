import { Module } from '@nestjs/common';
import { WorkerAssignmentController } from '../controllers/worker-assignment.controller';
import {
  WorkerAssignmentCreateService,
  WorkerAssignmentReadService,
  WorkerAssignmentUpdateService,
} from '../services/worker-assignment';

@Module({
  controllers: [WorkerAssignmentController],
  providers: [
    WorkerAssignmentCreateService,
    WorkerAssignmentReadService,
    WorkerAssignmentUpdateService,
  ],
})
export class WorkerAssignmentModule {}
