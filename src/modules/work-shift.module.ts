import { Module } from '@nestjs/common';
import { WorkShiftController } from '../controllers/work-shift.controller';
import {
  CreateWorkShiftService,
  DeleteWorkShiftService,
  ReadWorkShiftsService,
  UpdateWorkShiftService,
} from '../services/work-shift';
import { CommonModule } from './common.module';

@Module({
  imports: [CommonModule],
  controllers: [WorkShiftController],
  providers: [
    CreateWorkShiftService,
    DeleteWorkShiftService,
    ReadWorkShiftsService,
    UpdateWorkShiftService,
  ],
  exports: [
    CreateWorkShiftService,
    DeleteWorkShiftService,
    ReadWorkShiftsService,
    UpdateWorkShiftService,
  ],
})
export class WorkShiftModule {}
