import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { WorkerId } from 'src/types/worker';
import type { Admin } from 'src/types/auth';

@Injectable()
export class WorkerDeleteService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async delete(
    id: WorkerId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    bodyLocalityId: string,
  ): Promise<void> {
    // localityId viene del body
    const localityId = this.localityResolver.resolve(admin, bodyLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    const worker = await db.worker.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }

    await db.worker.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
