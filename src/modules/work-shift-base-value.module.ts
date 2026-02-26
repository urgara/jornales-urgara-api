import { Module } from '@nestjs/common';
import { WorkShiftBaseValueController } from '../controllers/work-shift-base-value.controller';
import {
  CreateWorkShiftBaseValueService,
  DeleteWorkShiftBaseValueService,
  ReadWorkShiftBaseValueService,
} from '../services/work-shift-base-value';
import { CommonModule } from './common.module';

@Module({
  imports: [CommonModule],
  controllers: [WorkShiftBaseValueController],
  providers: [
    CreateWorkShiftBaseValueService,
    ReadWorkShiftBaseValueService,
    DeleteWorkShiftBaseValueService,
  ],
  exports: [
    CreateWorkShiftBaseValueService,
    ReadWorkShiftBaseValueService,
    DeleteWorkShiftBaseValueService,
  ],
})
export class WorkShiftBaseValueModule {}
