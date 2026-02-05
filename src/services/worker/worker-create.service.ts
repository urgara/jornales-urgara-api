import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  UuidService,
  LocalityResolverService,
} from '../common';
import { LocalityValidationService } from '../locality';
import type { CreateWorker, Worker } from 'src/types/worker';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';

@Injectable()
export class WorkerCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityValidationService: LocalityValidationService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async create(
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: CreateWorker & LocalityOperationContext,
  ): Promise<Worker> {
    // localityId viene del body (data.localityId)
    const localityId = this.localityResolver.resolve(admin, data.localityId);

    // Validar que la localidad existe
    await this.localityValidationService.validateExists(localityId);

    const db = this.databaseService.getTenantClient(localityId);
    return await db.worker.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
        surname: data.surname,
        dni: data.dni,
        localityId: localityId,
        baseHourlyRate: data.baseHourlyRate,
        category: data.category,
      },
    });
  }
}
