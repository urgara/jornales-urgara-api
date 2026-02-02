import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, UuidService } from '../common';
import type { CreateWorker, Worker } from 'src/types/worker';

@Injectable()
export class WorkerCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateWorker): Promise<Worker> {
    return await this.databaseService.worker.create({
      data: {
        id: this.uuidService.V4(),
        name: data.name,
        surname: data.surname,
        dni: data.dni,
        companyId: data.companyId ?? null,
        localityId: data.localityId,
        baseHourlyRate: data.baseHourlyRate,
      },
    });
  }
}
