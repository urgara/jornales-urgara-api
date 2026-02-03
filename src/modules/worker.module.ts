import { Module } from '@nestjs/common';
import { WorkerController } from '../controllers/worker.controller';
import {
  WorkerCreateService,
  WorkerReadService,
  WorkerUpdateService,
  WorkerDeleteService,
} from '../services/worker';
import { LocalityModule } from './locality.module';
import { CompanyModule } from './company.module';

@Module({
  imports: [LocalityModule, CompanyModule],
  controllers: [WorkerController],
  providers: [
    WorkerCreateService,
    WorkerReadService,
    WorkerUpdateService,
    WorkerDeleteService,
  ],
})
export class WorkerModule {}
