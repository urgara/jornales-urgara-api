import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type {
  WorkShiftConfig,
  CreateOrUpdateWorkShiftConfig,
} from 'src/types/work-shift';

@Injectable()
export class CreateConfigWorkShiftService {
  constructor(private readonly databaseService: DatabaseService) {}

  async upsert(data: CreateOrUpdateWorkShiftConfig): Promise<WorkShiftConfig> {
    const configJson = JSON.stringify(data.config);

    return await this.databaseService.workShiftConfig.upsert({
      where: { id: data.id },
      create: { id: data.id, config: configJson },
      update: { config: configJson },
    });
  }
}
