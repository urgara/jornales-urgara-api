import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import type { WorkShiftId } from 'src/types/work-shift';
import type { Admin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class DeleteWorkShiftService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async delete(
    id: WorkShiftId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    bodyLocalityId: string,
  ): Promise<void> {
    // localityId viene del body
    const localityId = this.localityResolver.resolve(admin, bodyLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    // Verificar si el work shift existe
    const existingWorkShift = await db.workShift.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingWorkShift) {
      throw new NotFoundException('Work shift not found');
    }

    await db.workShift.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
