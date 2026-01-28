import { Module } from '@nestjs/common';
import { WorkerController } from '../controllers/worker.controller';
import {
  WorkerCreateService,
  WorkerReadService,
  WorkerUpdateService,
  WorkerDeleteService,
} from '../services/worker';

@Module({
  controllers: [WorkerController],
  providers: [
    WorkerCreateService,
    WorkerReadService,
    WorkerUpdateService,
    WorkerDeleteService,
  ],
})
export class WorkerModule {}
