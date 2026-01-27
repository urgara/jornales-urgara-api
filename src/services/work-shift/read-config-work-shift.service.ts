import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import { WorkShiftConfigId } from '../../types/work-shift';

@Injectable()
export class ReadConfigWorkShiftService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: WorkShiftConfigId) {
    return await this.databaseService.workShiftConfig.findUnique({
      where: { id },
    });
  }
}
