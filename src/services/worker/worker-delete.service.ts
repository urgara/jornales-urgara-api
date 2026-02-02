import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { WorkerId } from 'src/types/worker';

@Injectable()
export class WorkerDeleteService {
  constructor(private readonly databaseService: DatabaseLocalityService) {}

  async delete(id: WorkerId): Promise<void> {
    const worker = await this.databaseService.worker.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }

    await this.databaseService.worker.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
