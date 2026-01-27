import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type { WorkShiftId } from 'src/types/work-shift';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class DeleteWorkShiftService {
  constructor(private readonly databaseService: DatabaseService) {}

  async delete(id: WorkShiftId) {
    // Verificar si el work shift existe
    const existingWorkShift = await this.databaseService.workShift.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingWorkShift) {
      throw new NotFoundException('Work shift not found');
    }

    await this.databaseService.workShift.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
