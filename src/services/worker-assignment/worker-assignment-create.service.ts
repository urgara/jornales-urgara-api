import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  DatabaseCommonService,
  UuidService,
  LocalityResolverService,
} from '../common';
import type { CreateWorkerAssignment } from 'src/types/worker-assignment';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { BadRequestException, NotFoundException } from 'src/exceptions/common';
import { WorkerAssignmentCalculationService } from './worker-assignment-calculation.service';

@Injectable()
export class WorkerAssignmentCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly databaseCommon: DatabaseCommonService,
    private readonly uuidService: UuidService,
    private readonly localityResolver: LocalityResolverService,
    private readonly calculationService: WorkerAssignmentCalculationService,
  ) {}

  async create(
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: CreateWorkerAssignment & LocalityOperationContext,
  ) {
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const {
      workShiftId,
      date,
      workers,
      companyId,
      companyRole,
      terminalId,
      productId,
      shipId,
      jc,
    } = data;

    const db = this.databaseService.getTenantClient(localityId);

    // Verificar que el turno existe
    const workShift = await db.workShift.findUnique({
      where: { id: workShiftId, deletedAt: null },
    });

    if (!workShift) {
      throw new NotFoundException('Work shift not found');
    }

    // Validar no hay workerIds duplicados
    const workerIds = workers.map((w) => w.workerId);
    const uniqueWorkerIds = new Set(workerIds);
    if (uniqueWorkerIds.size !== workerIds.length) {
      throw new BadRequestException(
        'Duplicate worker IDs found in the request',
      );
    }

    // Verificar que todos los trabajadores existen
    const existingWorkers = await db.worker.findMany({
      where: { id: { in: workerIds }, deletedAt: null },
      select: { id: true },
    });

    if (existingWorkers.length !== workerIds.length) {
      const existingIds = new Set(
        existingWorkers.map((w: { id: string }) => w.id),
      );
      const missingIds = workerIds.filter((id) => !existingIds.has(id));
      throw new NotFoundException(
        `Workers not found: ${missingIds.join(', ')}`,
      );
    }

    // Validar que la localidad permite JC si viene activado
    const isJc = jc ?? false;
    if (isJc) {
      const locality = await this.databaseCommon.locality.findUnique({
        where: { id: localityId },
        select: { isCalculateJc: true },
      });

      if (!locality || !locality.isCalculateJc) {
        throw new BadRequestException(
          'This locality does not have JC (jornal caído) enabled',
        );
      }
    }

    // Calcular amounts para cada worker
    const detailsData = await Promise.all(
      workers.map((worker) =>
        this.calculationService.calculateWorkerDetail(db, worker, isJc),
      ),
    );

    // Convertir fecha string a Date
    const assignmentDate = new Date(date);
    const headerId = this.uuidService.V6();

    // Crear header + details en transacción
    const assignment = await db.$transaction(async (tx: any) => {
      const header = await tx.workerAssignment.create({
        data: {
          id: headerId,
          workShiftId,
          date: assignmentDate,
          companyId,
          companyRole,
          localityId,
          terminalId,
          productId,
          shipId,
          jc: jc ?? false,
        },
      });

      await tx.workerAssignmentDetail.createMany({
        data: detailsData.map((detail) => ({
          ...detail,
          workerAssignmentId: headerId,
        })),
      });

      return tx.workerAssignment.findUnique({
        where: { id: header.id },
        include: { WorkerAssignmentDetail: true },
      });
    });

    // Mapear WorkerAssignmentDetail → workers
    const { WorkerAssignmentDetail, ...header } = assignment;
    return { ...header, workers: WorkerAssignmentDetail };
  }
}
