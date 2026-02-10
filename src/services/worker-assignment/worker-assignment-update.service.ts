import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  DecimalService,
  LocalityResolverService,
} from '../common';
import type {
  WorkerAssignmentId,
  UpdateWorkerAssignment,
} from 'src/types/worker-assignment';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentUpdateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly decimalService: DecimalService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async update(
    id: WorkerAssignmentId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: UpdateWorkerAssignment & Partial<LocalityOperationContext>,
  ) {
    // localityId viene del body (data.localityId) - opcional para PATCH
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const db = this.databaseService.getTenantClient(localityId);
    // Verificar que la asignación existe
    const existingAssignment = await db.workerAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Worker assignment not found');
    }

    const dataToUpdate: any = {};

    // Si se actualiza workerId, verificar que existe
    if (data.workerId !== undefined) {
      const worker = await db.worker.findUnique({
        where: { id: data.workerId, deletedAt: null },
      });

      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      dataToUpdate.workerId = data.workerId;
    }

    // Si se actualiza workShiftId, verificar que existe
    if (data.workShiftId !== undefined) {
      const workShift = await db.workShift.findUnique({
        where: { id: data.workShiftId, deletedAt: null },
      });

      if (!workShift) {
        throw new NotFoundException('Work shift not found');
      }

      dataToUpdate.workShiftId = data.workShiftId;
    }

    if (data.date !== undefined) {
      dataToUpdate.date = new Date(data.date);
    }

    if (data.additionalPercent !== undefined) {
      dataToUpdate.additionalPercent = data.additionalPercent;
    }

    /**
     * Recalcular totalAmount si se actualizó algún campo que afecta el cálculo
     */
    if (
      data.workerId !== undefined ||
      data.workShiftId !== undefined ||
      data.additionalPercent !== undefined
    ) {
      // Obtener datos necesarios para el cálculo
      const finalWorkerId = data.workerId ?? existingAssignment.workerId;
      const finalWorkShiftId =
        data.workShiftId ?? existingAssignment.workShiftId;
      const finalAdditionalPercent =
        data.additionalPercent !== undefined
          ? data.additionalPercent
          : existingAssignment.additionalPercent;

      const [worker, workShift] = await Promise.all([
        db.worker.findUnique({
          where: { id: finalWorkerId },
        }),
        db.workShift.findUnique({
          where: { id: finalWorkShiftId },
        }),
      ]);

      if (!worker || !workShift) {
        throw new NotFoundException('Worker or WorkShift not found');
      }

      // Calcular totalAmount
      const durationHours = this.decimalService.divide(
        this.decimalService.create(workShift.durationMinutes),
        60,
      );

      const baseAmount = this.decimalService.multiply(
        worker.baseHourlyRate,
        durationHours,
      );

      let totalAmount = baseAmount;

      if (finalAdditionalPercent) {
        const percentMultiplier = this.decimalService.add(
          this.decimalService.create(1),
          this.decimalService.divide(
            this.decimalService.create(finalAdditionalPercent),
            100,
          ),
        );

        totalAmount = this.decimalService.multiply(
          baseAmount,
          percentMultiplier,
        );
      }

      dataToUpdate.totalAmount = totalAmount;
    }

    const updatedAssignment = await db.workerAssignment.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedAssignment;
  }
}
