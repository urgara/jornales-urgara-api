import { Module } from '@nestjs/common';
import { WorkShiftController } from '../controllers/work-shift.controller';
import {
  CreateConfigWorkShiftService,
  CreateValuesWorkShiftService,
  CreateWorkShiftService,
  DeleteWorkShiftService,
  ReadConfigWorkShiftService,
  ReadWorkShiftsService,
  UpdateWorkShiftService,
} from '../services/work-shift';
import { CommonModule } from './common.module';

@Module({
  imports: [CommonModule],
  controllers: [WorkShiftController],
  providers: [
    CreateConfigWorkShiftService,
    CreateValuesWorkShiftService,
    CreateWorkShiftService,
    DeleteWorkShiftService,
    ReadConfigWorkShiftService,
    ReadWorkShiftsService,
    UpdateWorkShiftService,
  ],
  exports: [
    CreateConfigWorkShiftService,
    CreateValuesWorkShiftService,
    CreateWorkShiftService,
    DeleteWorkShiftService,
    ReadConfigWorkShiftService,
    ReadWorkShiftsService,
    UpdateWorkShiftService,
  ],
})
export class WorkShiftModule {}
