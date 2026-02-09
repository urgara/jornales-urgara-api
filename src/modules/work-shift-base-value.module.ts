import { Module } from '@nestjs/common';
import { WorkShiftBaseValueController } from '../controllers/work-shift-base-value.controller';
import {
  CreateWorkShiftBaseValueService,
  ReadWorkShiftBaseValueService,
} from '../services/work-shift-base-value';
import { CommonModule } from './common.module';

@Module({
  imports: [CommonModule],
  controllers: [WorkShiftBaseValueController],
  providers: [CreateWorkShiftBaseValueService, ReadWorkShiftBaseValueService],
  exports: [CreateWorkShiftBaseValueService, ReadWorkShiftBaseValueService],
})
export class WorkShiftBaseValueModule {}
