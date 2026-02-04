import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, UuidService } from '../common';
import { LocalityValidationService } from '../locality';
import type { CreateWorker, Worker } from 'src/types/worker';
import type { Admin } from 'src/types/auth';
import { AdminRole } from 'src/types/auth';
import { BadRequestException } from 'src/exceptions/common';
import { ForbiddenException } from 'src/exceptions/common/auth';

@Injectable()
export class WorkerCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityValidationService: LocalityValidationService,
  ) {}

  async create(
    data: CreateWorker,
    requestingAdmin: Pick<Admin, 'role' | 'localityId'> & { sessionId: string },
  ): Promise<Worker> {
    let localityId: string;

    if (requestingAdmin.role === AdminRole.ADMIN) {
      // ADMIN debe proporcionar localityId y puede usar cualquiera
      if (!data.localityId) {
        throw new BadRequestException(
          'ADMIN role must provide localityId when creating a worker',
        );
      }
      localityId = data.localityId;
    } else if (requestingAdmin.role === AdminRole.LOCAL) {
      // LOCAL siempre usa su propia localityId
      if (!requestingAdmin.localityId) {
        throw new BadRequestException(
          'LOCAL admin does not have a locality assigned',
        );
      }

      // Si LOCAL intenta especificar una localidad diferente a la suya → error
      if (data.localityId && data.localityId !== requestingAdmin.localityId) {
        throw new ForbiddenException(
          'LOCAL admin can only create workers in their own locality',
        );
      }

      localityId = requestingAdmin.localityId;
    } else {
      throw new BadRequestException('Invalid admin role for creating workers');
    }

    // Validar que la localidad existe
    await this.localityValidationService.validateExists(localityId);

    return await this.databaseService.worker.create({
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
