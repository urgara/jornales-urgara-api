import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, UuidService } from '../common';
import { LocalityValidationService } from '../locality';
import { CompanyValidationService } from '../company';
import type { CreateWorker, Worker } from 'src/types/worker';

@Injectable()
export class WorkerCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityValidationService: LocalityValidationService,
    private readonly companyValidationService: CompanyValidationService,
  ) {}

  async create(data: CreateWorker): Promise<Worker> {
    // Validate that locality and company exist in prisma-global
    await Promise.all([
      this.localityValidationService.validateExists(data.localityId),
      this.companyValidationService.validateExists(data.companyId),
    ]);

    return await this.databaseService.worker.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
        surname: data.surname,
        dni: data.dni,
        localityId: data.localityId,
        companyId: data.companyId,
        baseHourlyRate: data.baseHourlyRate,
        category: data.category,
      },
    });
  }
}
