import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, UuidService } from '../common';
import { LocalityValidationService } from '../locality';
import type { CreateWorker, Worker } from 'src/types/worker';

@Injectable()
export class WorkerCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityValidationService: LocalityValidationService,
  ) {}

  async create(data: CreateWorker): Promise<Worker> {
    // Validate that locality and company exist in prisma-global

    await this.localityValidationService.validateExists(data.localityId);
    return await this.databaseService.worker.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
        surname: data.surname,
        dni: data.dni,
        localityId: data.localityId,
        baseHourlyRate: data.baseHourlyRate,
        category: data.category,
      },
    });
  }
}
