import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { WorkerId, UpdateWorker, Worker } from 'src/types/worker';

@Injectable()
export class WorkerUpdateService {
  constructor(private readonly databaseService: DatabaseLocalityService) {}

  async update(id: WorkerId, data: UpdateWorker): Promise<Worker> {
    const worker = await this.databaseService.worker.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }

    return await this.databaseService.worker.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.surname !== undefined && { surname: data.surname }),
        ...(data.dni !== undefined && { dni: data.dni }),
        ...(data.localityId !== undefined && {
          localityId: data.localityId,
        }),
        ...(data.baseHourlyRate !== undefined && {
          baseHourlyRate: data.baseHourlyRate,
        }),
        ...(data.category !== undefined && { category: data.category }),
      },
    });
  }
}
