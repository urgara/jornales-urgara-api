import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import type { WorkShiftBaseValueId } from 'src/types/work-shift-base-value';
import type { Admin } from 'src/types/auth';
import {
  NotFoundException,
  ResourceConflictException,
} from 'src/exceptions/common';

@Injectable()
export class DeleteWorkShiftBaseValueService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async delete(
    id: WorkShiftBaseValueId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    localityId: string,
  ): Promise<void> {
    const resolvedLocalityId = this.localityResolver.resolve(
      admin,
      localityId,
    );
    const db = this.databaseService.getTenantClient(resolvedLocalityId);

    const existing = await db.workShiftBaseValue.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Work shift base value not found');
    }

    const usageCount = await db.workerAssignmentDetail.count({
      where: { workShiftBaseValueId: id },
    });

    if (usageCount > 0) {
      throw new ResourceConflictException(
        'Work shift base value cannot be deleted because it has been used in worker assignments',
      );
    }

    await db.workShiftCalculatedValue.deleteMany({
      where: { workShiftBaseValueId: id },
    });

    await db.workShiftBaseValue.delete({
      where: { id },
    });
  }
}
