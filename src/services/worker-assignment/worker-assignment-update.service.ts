import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  DatabaseCommonService,
  LocalityResolverService,
} from '../common';
import type {
  WorkerAssignmentId,
  UpdateWorkerAssignment,
} from 'src/types/worker-assignment';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { BadRequestException, NotFoundException } from 'src/exceptions/common';
import { WorkerAssignmentCalculationService } from './worker-assignment-calculation.service';

@Injectable()
export class WorkerAssignmentUpdateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly databaseCommon: DatabaseCommonService,
    private readonly localityResolver: LocalityResolverService,
    private readonly calculationService: WorkerAssignmentCalculationService,
  ) {}

  async update(
    id: WorkerAssignmentId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: UpdateWorkerAssignment & Partial<LocalityOperationContext>,
  ) {
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const db = this.databaseService.getTenantClient(localityId);

    // Verificar que la asignación existe
    const existingAssignment = await db.workerAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Worker assignment not found');
    }

    const headerUpdate: any = {};

    // Si se actualiza workShiftId, verificar que existe
    if (data.workShiftId !== undefined) {
      const workShift = await db.workShift.findUnique({
        where: { id: data.workShiftId, deletedAt: null },
      });

      if (!workShift) {
        throw new NotFoundException('Work shift not found');
      }

      headerUpdate.workShiftId = data.workShiftId;
    }

    if (data.date !== undefined) {
      headerUpdate.date = new Date(data.date);
    }

    if (data.companyId !== undefined) {
      headerUpdate.companyId = data.companyId;
    }

    if (data.companyRole !== undefined) {
      headerUpdate.companyRole = data.companyRole;
    }

    if (data.jc !== undefined) {
      headerUpdate.jc = data.jc;
    }

    if (data.terminalId !== undefined) {
      headerUpdate.terminalId = data.terminalId;
    }

    if (data.productId !== undefined) {
      headerUpdate.productId = data.productId;
    }

    if (data.shipId !== undefined) {
      headerUpdate.shipId = data.shipId;
    }

    // Full replacement de workers si vienen en el payload
    if (data.workers !== undefined && data.workers.length > 0) {
      const workers = data.workers;

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
        const missingIds = workerIds.filter(
          (wId: string) => !existingIds.has(wId),
        );
        throw new NotFoundException(
          `Workers not found: ${missingIds.join(', ')}`,
        );
      }

      // Determinar si el jc está activo (del update o del existente)
      const isJc = data.jc !== undefined ? data.jc : existingAssignment.jc;
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

      // Transacción: actualizar header + reemplazar details
      const assignment = await db.$transaction(async (tx: any) => {
        // Actualizar header
        await tx.workerAssignment.update({
          where: { id },
          data: headerUpdate,
        });

        // Eliminar details existentes
        await tx.workerAssignmentDetail.deleteMany({
          where: { workerAssignmentId: id },
        });

        // Crear nuevos details
        await tx.workerAssignmentDetail.createMany({
          data: detailsData.map((detail) => ({
            ...detail,
            workerAssignmentId: id,
          })),
        });

        return tx.workerAssignment.findUnique({
          where: { id },
          include: { WorkerAssignmentDetail: true },
        });
      });

      const { WorkerAssignmentDetail, ...header } = assignment;
      return { ...header, workers: WorkerAssignmentDetail };
    }

    // Solo actualizar header (sin cambiar workers)
    const updatedAssignment = await db.workerAssignment.update({
      where: { id },
      data: headerUpdate,
      include: { WorkerAssignmentDetail: true },
    });

    const { WorkerAssignmentDetail, ...header } = updatedAssignment;
    return { ...header, workers: WorkerAssignmentDetail };
  }
}
