import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { WorkerId, UpdateWorker, Worker } from 'src/types/worker';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';

@Injectable()
export class WorkerUpdateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async update(
    id: WorkerId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: UpdateWorker & Partial<LocalityOperationContext>,
  ): Promise<Worker> {
    // localityId viene del body (data.localityId) - opcional para PATCH
    const localityId = this.localityResolver.resolve(admin, data.localityId);
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

    return await db.worker.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.surname !== undefined && { surname: data.surname }),
        ...(data.dni !== undefined && { dni: data.dni }),
        ...(data.category !== undefined && { category: data.category }),
      },
    });
  }
}
